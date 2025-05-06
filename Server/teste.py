import os
import sys
import findspark

# Inicializar o findspark para configurar o ambiente do Spark
findspark.init()

from pyspark.sql import SparkSession

def verificar_ambiente():
    """Verifica as configurações do ambiente"""
    print("\n=== VERIFICAÇÃO DE AMBIENTE ===")
    
    # Verificar variáveis de ambiente essenciais
    for var in ['JAVA_HOME', 'SPARK_HOME']:
        if var not in os.environ:
            print(f"❌ {var} não está configurado")
        else:
            print(f"✅ {var}: {os.environ[var]}")

def testar_conexao_mysql():
    """Testa a conexão com o MySQL"""
    # Configuração da conexão
    db_config = {
        "url": "jdbc:mysql://localhost:3306/gorider",
        "properties": {
            "user": "root",
            "password": "pe12qo96G@a",  # Substitua por variável de ambiente em produção
            "driver": "com.mysql.cj.jdbc.Driver"
        }
    }

    try:
        # Inicializar Spark
        spark = SparkSession.builder \
            .appName("TesteMySQL") \
            .config("spark.jars", os.path.join(os.environ['SPARK_HOME'], "jars", "mysql-connector-j-9.3.0.jar")) \
            .config("spark.local.dir", "C:/SparkTempCustom") \
            .getOrCreate()

        print("\n=== TESTE DE CONEXÃO ===")
        
        # Testar conexão
        df = spark.read.jdbc(
            table="Clientes",
            **db_config
        )
        
        print("✅ Conexão bem-sucedida!")
        print(f"Total de registros: {df.count()}")
        df.show(5, truncate=False)
        
        return True
        
    except Exception as e:
        print(f"❌ Falha na conexão: {str(e)}")
        print("\nSolução:")
        print("1. Verifique se o MySQL está rodando")
        print("2. Confira se o banco 'clientes' existe")
        print("3. Valide usuário/senha")
        print("4. Verifique o driver JDBC em SPARK_HOME/jars/")
        return False
    finally:
        if 'spark' in locals():
            spark.stop()

if __name__ == "__main__":
    verificar_ambiente()
    
    if testar_conexao_mysql():
        print("\n🎉 Ambiente configurado com sucesso!")
    else:
        print("\n🔧 Corrija os problemas acima e tente novamente")
        sys.exit(1)