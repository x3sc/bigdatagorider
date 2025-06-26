import os
import findspark
from fastapi import APIRouter, HTTPException, Depends
from pyspark.sql import SparkSession
from dotenv import load_dotenv
from .utils import get_db_connection, sanitize_email, sanitize_string
import pymysql
from .dependencies import get_current_user
from pydantic import BaseModel

load_dotenv("server.env")
findspark.init()

router = APIRouter()

def get_spark():
    return SparkSession.builder \
        .appName("API_PySpark_MySQL") \
        .config("spark.jars", os.path.join(os.environ['SPARK_HOME'], "jars", "mysql-connector-j-9.3.0.jar")) \
        .config("spark.local.dir", "C:/SparkTempCustom") \
        .getOrCreate()

db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

db_config = {
    "url": f"jdbc:mysql://{db_host}:{db_port}/{db_name}",
    "properties": {
        "user": db_user,
        "password": db_password,
        "driver": "com.mysql.cj.jdbc.Driver"
    }
}

@router.get("/clientes")
def listar_clientes():
    spark = get_spark()
    try:
        df = spark.read.jdbc(
            table="Clientes",
            **db_config
        )
        clientes = df.limit(100).toPandas().to_dict(orient="records")
        return clientes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        spark.stop()

# Novo endpoint para buscar o perfil do cliente
@router.get("/perfil-cliente/{cliente_id}")
def get_perfil_cliente(cliente_id: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Query para buscar os dados do cliente
        query = """
            SELECT
                u.ID_Usuario as id,
                u.Nome as nome,
                u.Email as email,
                u.Telefone as telefone,
                u.Foto_URL as fotoUrl,
                c.CPF as cpf,
                c.DataNascimento as dataNascimento
            FROM Usuarios u
            JOIN Clientes c ON u.ID_Usuario = c.ID_Usuario
            WHERE u.ID_Usuario = %s AND u.TipoUsuario = 'cliente'
        """
        cursor.execute(query, (cliente_id,))
        cliente = cursor.fetchone()

        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        # Query para buscar as avaliações feitas pelo cliente
        query_avaliacoes = """
            SELECT
                a.Estrelas as estrelas,
                a.Comentario as comentario,
                u.Nome as nome_prestador,
                a.ID_Prestador as id_prestador
            FROM Avaliacoes a
            JOIN Usuarios u ON a.ID_Prestador = u.ID_Usuario
            WHERE a.ID_Cliente = %s
            ORDER BY a.DataAvaliacao DESC
        """
        cursor.execute(query_avaliacoes, (cliente_id,))
        avaliacoes = cursor.fetchall()

        cliente['avaliacoes'] = avaliacoes

        return cliente

    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar perfil do cliente")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Modelo para atualização de perfil
class PerfilClienteUpdate(BaseModel):
    nome: str
    telefone: str
    fotoUrl: str = None

# Endpoint para atualizar perfil do cliente
@router.put("/perfil-cliente/{cliente_id}")
def update_perfil_cliente(cliente_id: int, perfil_data: PerfilClienteUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente' or current_user.get('id') != cliente_id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Atualizar dados na tabela Usuarios
        query = """
            UPDATE Usuarios 
            SET Nome = %s, Telefone = %s, Foto_URL = %s
            WHERE ID_Usuario = %s AND TipoUsuario = 'cliente'
        """
        cursor.execute(query, (
            perfil_data.nome,
            perfil_data.telefone,
            perfil_data.fotoUrl,
            cliente_id
        ))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        conn.commit()
        return {"message": "Perfil atualizado com sucesso"}

    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar perfil do cliente")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()