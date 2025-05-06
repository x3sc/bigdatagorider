import os
import findspark
from fastapi import APIRouter, HTTPException
from pyspark.sql import SparkSession
from dotenv import load_dotenv

load_dotenv()
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