# Server/perfil_prestador.py

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
import pymysql
from .utils import get_db_connection

router = APIRouter()

# Modelo para os dados que podem ser atualizados no perfil do prestador
class PerfilPrestadorUpdate(BaseModel):
    ocupacao_cargo: str | None = None
    sobre_mim: str | None = None
    historico_profissional: str | None = None

# Endpoint para buscar os dados do perfil de um prestador
@router.get("/perfil-prestador/{id_prestador}")
def get_perfil_prestador(id_prestador: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Busca dados básicos do usuário
        cursor.execute("SELECT ID_Usuario, Nome, Sobrenome, Email, Tipo FROM Usuarios WHERE ID_Usuario = %s AND (Tipo = 1 OR Tipo = 2)", (id_prestador,))
        user_data = cursor.fetchone()

        if not user_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")

        # Busca dados do perfil em Sobre_Prestador
        cursor.execute("SELECT Ocupacao_Cargo, Sobre_Mim, Historico_Profissional, Nota_Media FROM Sobre_Prestador WHERE ID_Prestador = %s", (id_prestador,))
        perfil_data = cursor.fetchone()

        # Se não houver perfil, cria um registro vazio para consistência
        if not perfil_data:
            cursor.execute("INSERT INTO Sobre_Prestador (ID_Prestador) VALUES (%s)", (id_prestador,))
            conn.commit()
            perfil_data = {
                "Ocupacao_Cargo": None,
                "Sobre_Mim": None,
                "Historico_Profissional": None,
                "Nota_Media": 0.00
            }

        # Combina os dados
        full_profile = {**user_data, **perfil_data}
        return full_profile

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Endpoint para atualizar o perfil do prestador
@router.put("/perfil-prestador/{id_prestador}")
def update_perfil_prestador(id_prestador: int, perfil_update: PerfilPrestadorUpdate):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se o prestador existe
        cursor.execute("SELECT ID_Usuario FROM Usuarios WHERE ID_Usuario = %s AND (Tipo = 1 OR Tipo = 2)", (id_prestador,))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")

        # Monta a query de atualização dinamicamente
        update_fields = []
        update_values = []
        if perfil_update.ocupacao_cargo is not None:
            update_fields.append("Ocupacao_Cargo = %s")
            update_values.append(perfil_update.ocupacao_cargo)
        if perfil_update.sobre_mim is not None:
            update_fields.append("Sobre_Mim = %s")
            update_values.append(perfil_update.sobre_mim)
        if perfil_update.historico_profissional is not None:
            update_fields.append("Historico_Profissional = %s")
            update_values.append(perfil_update.historico_profissional)

        if not update_fields:
            return {"message": "Nenhum dado para atualizar."}

        query = f"UPDATE Sobre_Prestador SET {', '.join(update_fields)} WHERE ID_Prestador = %s"
        update_values.append(id_prestador)

        cursor.execute(query, tuple(update_values))
        conn.commit()

        if cursor.rowcount == 0:
            # Se nenhum registro foi atualizado, pode ser que o perfil não existia. Vamos criar.
            cursor.execute("INSERT INTO Sobre_Prestador (ID_Prestador) VALUES (%s)", (id_prestador,))
            conn.commit()
            # E rodar o update de novo
            cursor.execute(query, tuple(update_values))
            conn.commit()

        return {"message": "Perfil atualizado com sucesso!"}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
