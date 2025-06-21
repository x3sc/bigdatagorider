# Server/utils.py

import pymysql
import os
from dotenv import load_dotenv
import re
import html

# Carrega as variáveis de ambiente do arquivo .env
# Esta função procurará por um arquivo chamado '.env' na pasta atual.
load_dotenv()

def sanitize_input(data):
    """
    Limpa a entrada do usuário para prevenir XSS, removendo caracteres especiais de HTML.
    """
    if isinstance(data, str):
        return html.escape(data)
    return data

def get_db_connection():
    """
    Cria e retorna uma conexão com o banco de dados MySQL.
    As credenciais são lidas a partir do arquivo '.env'.
    """
    try:
        # Tenta estabelecer a conexão com o banco
        conn = pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return conn
    except Exception as e:
        # Se a conexão falhar, imprime o erro e relança a exceção.
        # Isto fará com que o servidor FastAPI pare se não conseguir conectar.
        print(f"Erro Crítico: Não foi possível conectar ao banco de dados: {e}")
        raise e

def sanitize_string(input_string: str) -> str:
    """
    Limpa uma string, removendo caracteres potencialmente perigosos.
    Ajuda a prevenir ataques básicos de injeção de SQL.
    """
    if not isinstance(input_string, str):
        return ""
    # Remove qualquer coisa que não seja alfanumérico, espaço, ou alguns caracteres seguros
    sanitized = re.sub(r"[^a-zA-Z0-9áéíóúÁÉÍÓÚâêîôûÂÊÎÔÛãõÃÕçÇ_.\-@\s]", "", input_string)
    return sanitized.strip() # Remove espaços em branco no início e no fim

def sanitize_email(email: str) -> str:
    """
    Limpa um endereço de e-mail de caracteres potencialmente perigosos.
    """
    if not isinstance(email, str):
        return ""
    # Remove caracteres que não são esperados em um email
    sanitized = re.sub(r'[^a-zA-Z0-9@._-]', '', email)
    return sanitized.strip()
