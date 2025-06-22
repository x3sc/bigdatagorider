# Server/cadastro_cliente.py

import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
import pymysql

from .security import hash_password
from .utils import get_db_connection, sanitize_string

# Configuração básica do logging para exibir informações detalhadas no terminal
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

router = APIRouter()

# Modelo de dados para o cadastro de cliente, alinhado com o formulário do frontend
class Cliente(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr
    senha: str
    cpf: str  # Corrigido de constr para str
    telefone: str
    data_nascimento: str # Recebe como string do formulário

@router.post("/cadastro-cliente", status_code=status.HTTP_201_CREATED)
def create_cliente(cliente: Cliente):
    """
    Endpoint para registrar um novo cliente.
    Recebe os dados do formulário, valida, e insere no banco de dados.
    """
    logging.info(f"Recebida requisição de cadastro para o e-mail: {cliente.email}")
    logging.info(f"Dados recebidos: {cliente.model_dump_json()}") # Loga todos os dados recebidos

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Validação e conversão da data de nascimento
        try:
            # Converte a string 'YYYY-MM-DD' para um objeto date
            data_nascimento_obj = datetime.strptime(cliente.data_nascimento, '%Y-%m-%d').date()
        except ValueError:
            # Se o formato for inválido, retorna um erro claro
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=[{"loc": ["body", "data_nascimento"], "msg": "Formato de data inválido. Use YYYY-MM-DD."}]
            )

        # Criptografa a senha antes de salvar
        hashed_password = hash_password(cliente.senha)

        # Query para inserir o novo cliente na tabela
        query = """
            INSERT INTO Clientes (Nome, Sobrenome, Email, Senha, CPF, Telefone, DataNascimento)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            sanitize_string(cliente.nome),
            sanitize_string(cliente.sobrenome),
            sanitize_string(str(cliente.email)),
            hashed_password,
            sanitize_string(cliente.cpf),
            sanitize_string(cliente.telefone),
            data_nascimento_obj  # Usa o objeto de data convertido
        ))
        conn.commit()
        
        return {"message": "Cliente cadastrado com sucesso!"}

    except pymysql.err.IntegrityError as e:
        # Trata erros de duplicação de chave (email ou CPF)
        error_message = str(e).lower()
        detail = "Erro de dados duplicados. Verifique o e-mail e o CPF."
        if "duplicate entry" in error_message:
            if "email" in error_message:
                detail = "Este endereço de e-mail já está em uso."
            elif "cpf" in error_message:
                detail = "Este CPF já pertence a outra conta."
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )
    except Exception as e:
        # Captura outros erros inesperados e loga o traceback completo para depuração
        logging.exception("Ocorreu um erro inesperado ao processar o cadastro do cliente:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro inesperado ao tentar cadastrar o cliente."
        )
    finally:
        # Garante que a conexão com o banco seja fechada
        if cursor:
            cursor.close()
        if conn:
            conn.close()
