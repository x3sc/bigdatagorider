# Server/auth.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Literal

from utils import get_db_connection, sanitize_string

router = APIRouter()

# Modelo de dados para o corpo da requisição de login
class LoginData(BaseModel):
    email: EmailStr
    senha: str
    tipo_usuario: Literal['cliente', 'prestador']

# Modelo de dados para a resposta de login bem-sucedido
class LoginResponse(BaseModel):
    message: str
    user_id: int
    user_type: str


@router.post("/login", response_model=LoginResponse)
def login_user(login_data: LoginData):
    """
    Endpoint para autenticar um usuário (cliente ou prestador).
    Verifica as credenciais no banco de dados.
    """
    conn = None
    cursor = None
    
    # Define a tabela e o campo de ID com base no tipo de usuário
    if login_data.tipo_usuario == 'cliente':
        table_name = "Clientes"
        id_field = "ID_Cliente"
    elif login_data.tipo_usuario == 'prestador':
        table_name = "Prestadores"
        id_field = "ID_Prestador"
    else:
        # Isso não deve acontecer devido à validação do Pydantic, mas é uma segurança extra
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de usuário inválido."
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Sanitiza os inputs para previnir SQL Injection
        email = sanitize_string(str(login_data.email))
        
        # Query para buscar o usuário pelo email
        # ATENÇÃO: A senha deve ser verificada após a busca, e idealmente usando hash.
        # Por simplicidade, estamos comparando a senha em texto plano aqui.
        query = f"SELECT {id_field}, Senha FROM {table_name} WHERE Email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        # Verifica se o usuário foi encontrado e se a senha corresponde
        if user and user['Senha'] == login_data.senha:
            return {
                "message": "Login bem-sucedido!",
                "user_id": user[id_field],
                "user_type": login_data.tipo_usuario
            }
        else:
            # Se não encontrar ou a senha estiver errada, retorna erro 401
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos."
            )

    except HTTPException as http_exc:
        # Re-levanta a exceção HTTP para que o FastAPI a manipule
        raise http_exc
    except Exception as e:
        # Log do erro seria ideal aqui
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno ao tentar fazer o login."
        )
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

