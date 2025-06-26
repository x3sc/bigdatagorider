# Server/avaliacoes.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import pymysql
from .utils import get_db_connection

router = APIRouter()

class AvaliacaoCreate(BaseModel):
    id_usuario_avaliador: int
    id_prestador_avaliado: int
    id_servico: int
    nota: int = Field(..., ge=0, le=5) # Garante que a nota esteja entre 0 e 5
    comentario: str | None = None

# Função para recalcular e atualizar a nota média do prestador
def update_nota_media(cursor, id_prestador: int):
    # Calcula a nova média de notas da tabela de avaliações
    cursor.execute("SELECT AVG(Nota) as media FROM Avaliacoes WHERE ID_Prestador_Avaliado = %s", (id_prestador,))
    result = cursor.fetchone()
    nova_media = result['media'] if result['media'] is not None else 0.0

    # Atualiza a nota média na tabela Sobre_Prestador
    cursor.execute("UPDATE Sobre_Prestador SET Nota_Media = %s WHERE ID_Prestador = %s", (nova_media, id_prestador))

@router.post("/avaliacoes", status_code=status.HTTP_201_CREATED)
def create_avaliacao(avaliacao: AvaliacaoCreate):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Insere a nova avaliação no banco de dados
        query = """
            INSERT INTO Avaliacoes (ID_Usuario_Avaliador, ID_Prestador_Avaliado, ID_Servico, Nota, Comentario)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            avaliacao.id_usuario_avaliador,
            avaliacao.id_prestador_avaliado,
            avaliacao.id_servico,
            avaliacao.nota,
            avaliacao.comentario
        ))

        # Atualiza a nota média do prestador
        update_nota_media(cursor, avaliacao.id_prestador_avaliado)

        conn.commit()
        return {"message": "Avaliação registrada com sucesso!"}

    except pymysql.err.IntegrityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Erro de integridade: {e}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@router.get("/avaliacoes/prestador/{id_prestador}")
def get_avaliacoes_prestador(id_prestador: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        query = """
            SELECT a.Nota, a.Comentario, a.DataAvaliacao, u.Nome as NomeAvaliador
            FROM Avaliacoes a
            JOIN Usuarios u ON a.ID_Usuario_Avaliador = u.ID_Usuario
            WHERE a.ID_Prestador_Avaliado = %s
            ORDER BY a.DataAvaliacao DESC
        """
        cursor.execute(query, (id_prestador,))
        avaliacoes = cursor.fetchall()
        return avaliacoes

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@router.get("/avaliacoes/cliente/{id_cliente}")
def get_avaliacoes_cliente(id_cliente: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # A query agora junta com a tabela de Prestadores para obter o nome do prestador avaliado
        query = """
            SELECT 
                a.ID_Avaliacao,
                a.ID_Servico,
                a.Nota,
                a.Comentario,
                a.DataAvaliacao,
                p.Nome AS NomePrestador, 
                p.Sobrenome AS SobrenomePrestador
            FROM Avaliacoes a
            JOIN Sobre_Prestador sp ON a.ID_Prestador_Avaliado = sp.ID_Prestador
            JOIN Usuarios p ON sp.ID_Usuario = p.ID_Usuario
            WHERE a.ID_Usuario_Avaliador = %s
            ORDER BY a.DataAvaliacao DESC
        """
        cursor.execute(query, (id_cliente,))
        avaliacoes = cursor.fetchall()
        return avaliacoes

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
