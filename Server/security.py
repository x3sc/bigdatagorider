# Server/security.py

from passlib.context import CryptContext

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

