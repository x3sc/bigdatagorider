import re

def sanitize_email(email: str) -> str:
    return email.strip().lower()

def sanitize_string(s: str, max_length=100) -> str:
    return s.strip()[:max_length]

def sanitize_numeric(n: str, max_length=20) -> str:
    """Permite apenas números e limita tamanho."""
    return re.sub(r"[^\d]", "", n)[:max_length]