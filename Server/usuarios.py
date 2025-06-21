# Server/usuarios.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from utils import get_db_connection, sanitize_string

router = APIRouter()

# Modelo para atualização de dados (todos os campos são opcionais)
class UserUpdate(BaseModel):
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    # Adicione outros campos que podem ser atualizados

@router.get("/usuarios/{tipo_usuario}/{user_id}")
def get_user_data(tipo_usuario: Literal['cliente', 'prestador'], user_id: int):
    """
    Busca os dados de um usuário específico (cliente ou prestador).
    NOTA: Em uma aplicação real, esta rota deve ser protegida para garantir
    que um usuário só possa ver seus próprios dados.
    """
    conn = None
    cursor = None

    if tipo_usuario == 'cliente':
        table_name = "Clientes"
        id_field = "ID_Cliente"
    else:
        table_name = "Prestadores"
        id_field = "ID_Prestador"
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Seleciona todos os campos, exceto a senha
        query = f"SELECT * FROM {table_name} WHERE {id_field} = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        if user:
            # Remove a senha da resposta para segurança
            user.pop('Senha', None) 
            return user
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado."
            )

    except Exception as e:
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar dados do usuário."
        )
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@router.put("/usuarios/{tipo_usuario}/{user_id}")
def update_user_data(tipo_usuario: Literal['cliente', 'prestador'], user_id: int, update_data: UserUpdate):
    """
    Atualiza os dados de um usuário específico.
    """
    conn = None
    cursor = None
    
    update_fields = update_data.model_dump(exclude_unset=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum dado fornecido para atualização."
        )

    if tipo_usuario == 'cliente':
        table_name = "Clientes"
        id_field = "ID_Cliente"
    else:
        table_name = "Prestadores"
        id_field = "ID_Prestador"
    
    set_clause = ", ".join([f"{key} = %s" for key in update_fields.keys()])
    values = [sanitize_string(str(v)) for v in update_fields.values()]
    values.append(user_id)
    
    query = f"UPDATE {table_name} SET {set_clause} WHERE {id_field} = %s"

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado para atualização."
            )

        return {"message": "Dados do usuário atualizados com sucesso!"}
    
    except Exception as e:
        print(f"Erro no servidor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar dados do usuário."
        )
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
