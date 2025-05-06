import os
import findspark
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pyspark.sql import SparkSession
from dotenv import load_dotenv

load_dotenv()

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

findspark.init()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] para testes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_spark():
    return SparkSession.builder \
        .appName("API_PySpark_MySQL") \
        .config("spark.jars", os.path.join(os.environ['SPARK_HOME'], "jars", "mysql-connector-j-9.3.0.jar")) \
        .config("spark.local.dir", "C:/SparkTempCustom") \
        .getOrCreate()

@app.get("/clientes")
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

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    spark = get_spark()
    try:
        df = spark.read.jdbc(
            table="Clientes",
            **db_config
        )
        usuario = df.filter((df.email == email) & (df.senha == password)).limit(1).toPandas()
        if not usuario.empty:
            return {"success": True}
        else:
            return {"success": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        spark.stop()