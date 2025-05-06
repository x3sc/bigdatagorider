import os
import pymysql
from fastapi import APIRouter, HTTPException, Body
from dotenv import load_dotenv

load_dotenv("server.env")

router = APIRouter()

db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

@router.post("/cadastrocliente")
def cadastrar_cliente(
    nome_cliente: str = Body(...),
    cpf: str = Body(...),
    email: str = Body(...),
    telefone: str = Body(...),
    senha: str = Body(...)
):
    try:
        conn = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            port=int(db_port)
        )
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO Clientes (nome_cliente, cpf, email, telefone, senha)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (nome_cliente, cpf, email, telefone, senha))
            conn.commit()
        return {"success": True, "message": "Cliente cadastrado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals():
            conn.close()