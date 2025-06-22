# Server/security.py

from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt

# Chave secreta para assinar o JWT. Em um ambiente de produção, isso deve ser
# uma string longa e aleatória, e deve ser mantida em segredo.
SECRET_KEY = "uma-chave-secreta-muito-segura-e-dificil-de-adivinhar" # Troque por uma chave segura em produção
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configura o contexto do passlib, especificando o algoritmo de hash a ser usado.
# "bcrypt" é uma escolha forte e amplamente recomendada.
# O parâmetro 'deprecated="auto"' garante compatibilidade com hashes futuros.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se uma senha em texto plano corresponde a um hash existente.

    Args:
        plain_password: A senha enviada pelo usuário no login.
        hashed_password: A senha hasheada armazenada no banco de dados.

    Returns:
        True se as senhas corresponderem, False caso contrário.
    """
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """
    Gera o hash de uma senha em texto plano.

    Args:
        password: A senha a ser hasheada.

    Returns:
        A string do hash da senha.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Cria um token JWT com os dados fornecidos.

    Args:
        data: Os dados a serem incluídos no token (ex: user_id, email).
        expires_delta: Tempo de expiração personalizado.

    Returns:
        O token JWT como string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

