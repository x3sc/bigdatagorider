# Server/cadastro_prestador.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from utils import get_db_connection, sanitize_string
import pymysql

router = APIRouter()

# Modelo de dados para o cadastro de prestador
class Prestador(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cpf: str
    telefone: str
    # Adicione outros campos que forem específicos para o prestador
    # Ex: cnh: str, tipo_veiculo: str

@router.post("/cadastro-prestador", status_code=status.HTTP_201_CREATED)
def create_prestador(prestador: Prestador):
    """
    Endpoint para registrar um novo prestador de serviço.
    """
    # Lembre-se de criar a tabela 'Prestadores' no seu banco de dados
    # CREATE TABLE Prestadores (
    #     ID_Prestador INT AUTO_INCREMENT PRIMARY KEY,
    #     Nome VARCHAR(100) NOT NULL,
    #     Email VARCHAR(100) NOT NULL UNIQUE,
    #     Senha VARCHAR(255) NOT NULL,
    #     CPF VARCHAR(14) NOT NULL UNIQUE,
    #     Telefone VARCHAR(20),
    #     DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    # );
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        nome = sanitize_string(prestador.nome)
        email = sanitize_string(str(prestador.email))
        cpf = sanitize_string(prestador.cpf)
        telefone = sanitize_string(prestador.telefone)
        senha = prestador.senha # Lembre-se de hashear a senha

        query = """
            INSERT INTO Prestadores (Nome, Email, Senha, CPF, Telefone)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nome, email, senha, cpf, telefone))
        conn.commit()

        return {"message": "Prestador cadastrado com sucesso!"}

    except pymysql.err.IntegrityError as e:
        if e.args[0] == 1062:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email ou CPF já cadastrado."
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
        if conn and conn.is_connected():
            conn.close()
