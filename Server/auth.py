# Server/auth.py

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from .utils import get_db_connection, sanitize_input
from .security import verify_password, create_access_token
import pymysql
from .dependencies import get_current_user

# Define o modelo de dados que a API espera receber no corpo da requisição de login
class LoginData(BaseModel):
    email: str
    password: str
    tipo: int # 0 para cliente, 1 para prestador

router = APIRouter()

@router.post("/login")
def login(login_data: LoginData):
    """
    Endpoint para autenticar um usuário na tabela unificada 'Usuarios'.
    Verifica as credenciais e o tipo de perfil solicitado.
    """
    email = sanitize_input(login_data.email)
    senha = login_data.password
    tipo_login = login_data.tipo

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Não foi possível conectar ao banco de dados.",
            )
        
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Busca o usuário na tabela unificada 'Usuarios'
        cursor.execute("SELECT * FROM Usuarios WHERE Email = %s", (email,))
        user = cursor.fetchone()

        # Se o usuário não for encontrado
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email não cadastrado.",
            )

        # Verifica a senha
        stored_password_hash = user.get('Senha')
        if not stored_password_hash or not verify_password(senha, stored_password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha incorreta.",
            )

        # Verifica se o tipo de usuário permite o login solicitado
        user_type_db = user.get('Tipo') # Tipo no banco: 0=cliente, 1=prestador, 2=ambos

        # Se o usuário for do tipo 2 (ambos), ele pode logar como cliente (0) ou prestador (1)
        # Se o tipo de login for diferente do tipo no banco e o tipo no banco não for 2, o acesso é negado
        if tipo_login != user_type_db and user_type_db != 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Você não tem permissão para acessar como {'cliente' if tipo_login == 0 else 'prestador'}.",
            )

        # Se tudo estiver correto, cria o token de acesso
        access_token = create_access_token(
            data={"sub": str(user['ID_Usuario']), "email": user['Email'], "tipo": 'cliente' if tipo_login == 0 else 'prestador'}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": 'cliente' if tipo_login == 0 else 'prestador'
        }

    except pymysql.MySQLError as e:
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro no servidor de banco de dados: {e}"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Erro inesperado no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro inesperado no servidor."
        )
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/users/me", response_model=dict)
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

