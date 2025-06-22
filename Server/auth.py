# Server/auth.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from .utils import get_db_connection, sanitize_input
from .security import verify_password
import pymysql

# Define o modelo de dados que a API espera receber no corpo da requisição de login
class LoginData(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/login")
def login(login_data: LoginData):
    """
    Endpoint para autenticar um usuário.
    Verifica as credenciais em ambas as tabelas 'cliente' e 'prestador'.
    """
    email = sanitize_input(login_data.email)
    senha = login_data.password # A senha não é sanitizada, pois será comparada com o hash

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            # Lança uma exceção se a conexão com o banco de dados falhar
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Não foi possível conectar ao banco de dados.",
            )
        
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # 1. Tenta encontrar o usuário na tabela de clientes
        # CORREÇÃO: Alterado de 'email_cliente' para 'Email'
        cursor.execute("SELECT * FROM Clientes WHERE Email = %s", (email,))
        user = cursor.fetchone()
        user_type = "cliente"

        # 2. Se não encontrar, tenta na tabela de prestadores
        if not user:
            # CORREÇÃO: Alterado de 'prestador' para 'Prestadores' e 'email_prestador' para 'Email'
            cursor.execute("SELECT * FROM Prestadores WHERE Email = %s", (email,))
            user = cursor.fetchone()
            user_type = "prestador"

        # 3. Se o usuário não foi encontrado em nenhuma tabela
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email não cadastrado.",
            )

        # 4. Verifica a senha
        # CORREÇÃO: Alterado de f'senha_{user_type}' para 'Senha'
        stored_password_hash = user.get('Senha')
        if not stored_password_hash or not verify_password(senha, stored_password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha incorreta.",
            )
        
        # 5. Se tudo estiver correto, retorna sucesso com os dados do usuário
        # Remove a senha do objeto de usuário antes de enviar a resposta
        # CORREÇÃO: Alterado de f'senha_{user_type}' para 'Senha'
        user.pop('Senha', None)

        return {
            "success": True,
            "message": "Login bem-sucedido!",
            "user": user,
            "user_type": user_type
        }

    except pymysql.MySQLError as e:
        # Captura erros específicos do MySQL
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro no servidor de banco de dados: {e}"
        )
    except Exception as e:
        # Captura qualquer outro erro inesperado
        print(f"Erro inesperado no servidor: {e}")
        # Re-levanta exceções HTTP que já foram tratadas (como 404 e 401)
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocorreu um erro inesperado no servidor."
        )
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

