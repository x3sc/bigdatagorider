# Server/cadastro_cliente.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import pymysql

from security import hash_password
from utils import get_db_connection, sanitize_string

router = APIRouter()

# ATUALIZAÇÃO: O modelo agora espera 'nomeCompleto' para corresponder ao formulário do frontend.
class Cliente(BaseModel):
    nomeCompleto: str
    email: EmailStr
    senha: str
    cpf: str
    telefone: str

@router.post("/cadastro-cliente", status_code=status.HTTP_201_CREATED)
def create_cliente(cliente: Cliente):
    """
    Endpoint para registrar um novo cliente, adaptado para receber 'nomeCompleto'.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        hashed_password = hash_password(cliente.senha)

        # ATUALIZAÇÃO: Divide o nomeCompleto em nome e sobrenome.
        # O primeiro nome é a primeira parte, e o sobrenome é todo o resto.
        # .strip() remove espaços extras no início ou fim.
        nome_parts = cliente.nomeCompleto.strip().split(" ", 1)
        nome = nome_parts[0]
        # Garante que o sobrenome seja uma string vazia se não houver segundo nome.
        sobrenome = nome_parts[1] if len(nome_parts) > 1 else ""

        # A query continua a inserir em 'nome' e 'sobrenome' no banco.
        query = """
            INSERT INTO Clientes (nome, sobrenome, email, senha, cpf, telefone)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            sanitize_string(nome),
            sanitize_string(sobrenome),
            sanitize_string(str(cliente.email)),
            hashed_password,
            sanitize_string(cliente.cpf),
            sanitize_string(cliente.telefone)
        ))
        conn.commit()
        
        return {"message": "Cliente cadastrado com sucesso!"}

    except pymysql.err.IntegrityError as e:
        error_message = str(e).lower()
        if "duplicate entry" in error_message:
            if "email" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este endereço de e-mail já está em uso."
                )
            elif "cpf" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este CPF já pertence a outra conta."
                )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Erro de dados duplicados. Verifique o e-mail e o CPF."
        )
    except Exception as e:
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro inesperado ao tentar cadastrar o cliente."
        )
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
