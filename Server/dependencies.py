from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import BaseModel
from . import security

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

class TokenData(BaseModel):
    id: int
    email: str
    tipo: str

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id = int(payload.get("sub"))
        email = payload.get("email")
        user_type = payload.get("tipo")

        if user_id is None or email is None or user_type is None:
            raise credentials_exception
            
        token_data = TokenData(id=user_id, email=email, tipo=user_type)

    except (jwt.PyJWTError, ValueError):
        raise credentials_exception

    return {"id": token_data.id, "email": token_data.email, "tipo": token_data.tipo}
