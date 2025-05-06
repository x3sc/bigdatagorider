import re
from utils import sanitize_email, sanitize_string

email = sanitize_email(data.get("email"))
password = sanitize_string(data.get("password"), max_length=50)

def sanitize_email(email: str) -> str:
    """Remove espaços e força minúsculas."""
    return email.strip().lower()

def sanitize_string(s: str, max_length=100) -> str:
    """Remove caracteres perigosos e limita tamanho."""
    s = s.strip()
    s = re.sub(r"[;'\"]", "", s)  # Remove aspas e ponto e vírgula
    return s[:max_length]

def sanitize_numeric(n: str, max_length=20) -> str:
    """Permite apenas números e limita tamanho."""
    return re.sub(r"[^\d]", "", n)[:max_length]