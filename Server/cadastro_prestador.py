# Server/cadastro_prestador.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import pymysql

from .security import hash_password
from .utils import get_db_connection, sanitize_string

router = APIRouter()

# Modelo de dados para o cadastro de prestador
class Prestador(BaseModel):
    nome: str
    sobrenome: str # Adicionado para corresponder ao formulário
    email: EmailStr
    senha: str
    cnpj: str # Alterado de cpf para cnpj
    telefone: str

@router.post("/cadastro-prestador", status_code=status.HTTP_201_CREATED)
def create_prestador(prestador: Prestador):
    """
    Endpoint para registrar um novo prestador de serviço.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Combina nome e sobrenome para o nome da empresa, ou pode ajustar conforme a lógica de negócio
        nome_completo = f"{sanitize_string(prestador.nome)} {sanitize_string(prestador.sobrenome)}"
        email = sanitize_string(str(prestador.email))
        cnpj = sanitize_string(prestador.cnpj)
        telefone = sanitize_string(prestador.telefone)
        senha_hashed = hash_password(prestador.senha)

        query = """
            INSERT INTO Prestadores (Nome, Email, Senha, CNPJ, Telefone)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nome_completo, email, senha_hashed, cnpj, telefone))
        conn.commit()

        return {"message": "Prestador cadastrado com sucesso!"}

    except pymysql.err.IntegrityError as e:
        if e.args[0] == 1062:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email ou CNPJ já cadastrado."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro de integridade no banco de dados: {e}"
            )
    except Exception as e:
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro ao tentar cadastrar o prestador."
        )
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
