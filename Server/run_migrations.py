import pymysql
import re
import os

# Importa a função de conexão a partir do diretório 'Server'
from utils import get_db_connection

def get_existing_columns(cursor, table_name):
    """Busca as colunas existentes de uma tabela no banco de dados."""
    try:
        # Usar crases para proteger nomes de tabelas que podem ser palavras-chave
        cursor.execute(f"DESCRIBE `{table_name}`;")
        return [row[0] for row in cursor.fetchall()]
    except pymysql.err.ProgrammingError as e:
        # Erro 1146: Tabela não existe, o que é esperado na primeira execução
        if e.args[0] == 1146:
            return []
        else:
            raise e

def parse_sql_schema(sql_content):
    """
    Faz o parsing do conteúdo SQL para extrair nomes de tabelas e definições de colunas.
    """
    schema = {}
    # Regex para encontrar blocos CREATE TABLE, ignorando case e lidando com crases opcionais
    table_definitions = re.findall(r"CREATE TABLE IF NOT EXISTS `?(\w+)`? \((.*?)\);", sql_content, re.DOTALL | re.IGNORECASE)
    
    for table_name, columns_str in table_definitions:
        columns = []
        # Remove comentários e normaliza espaços
        columns_str_cleaned = re.sub(r"--.*", "", columns_str)
        lines = [line.strip() for line in columns_str_cleaned.strip().split('\n') if line.strip()]
        
        for line in lines:
            line = line.rstrip(',') # Remove vírgula do final
            # Regex simplificada para extrair nome da coluna e sua definição completa
            match = re.match(r"`?(\w+)`?\s+(.*)", line, re.IGNORECASE)
            if match:
                col_name = match.group(1)
                col_def = match.group(2)
                # Ignora chaves (primária, estrangeira) e constraints na lista de colunas a serem adicionadas individualmente
                if col_name.upper() not in ('FOREIGN', 'PRIMARY', 'CONSTRAINT', 'KEY'):
                    columns.append({'name': col_name, 'definition': f"`{col_name}` {col_def}"})
        schema[table_name] = columns
        
    return schema

def run_migrations():
    """
    Lê o esquema do arquivo query_db.sql e aplica as migrações necessárias
    (cria tabelas e adiciona colunas faltantes).
    """
    conn = None
    try:
        print("Iniciando migração do banco de dados...")
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Ler o arquivo de esquema SQL que está no diretório raiz
        # O script está em 'Server', então voltamos um nível para encontrar 'query_db.sql'
        sql_file_path = os.path.join(os.path.dirname(__file__), '..', 'query_db.sql')
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # 2. Executar o script inteiro para garantir que as tabelas sejam criadas
        # pymysql pode executar múltiplos comandos se separados por ';'
        print("Executando CREATE TABLE IF NOT EXISTS para garantir que as tabelas existam...")
        sql_commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip()]
        for command in sql_commands:
            try:
                cursor.execute(command)
            except pymysql.err.MySQLError as e:
                # Ignora erros que podem ocorrer ao re-executar (ex: chaves já existem)
                print(f"Aviso ao executar comando: {e}")

        print("\nTabelas criadas/verificadas.")

        # 3. Analisar o esquema e verificar colunas faltantes
        print("\nVerificando consistência das colunas...")
        schema = parse_sql_schema(sql_content)
        
        for table_name, columns_in_schema in schema.items():
            print(f"Verificando tabela: `{table_name}`")
            existing_columns = get_existing_columns(cursor, table_name)
            
            for column_info in columns_in_schema:
                col_name = column_info['name']
                if col_name not in existing_columns:
                    print(f"  -> Coluna '{col_name}' não encontrada. Adicionando...")
                    col_definition = column_info['definition']
                    
                    alter_query = f"ALTER TABLE `{table_name}` ADD COLUMN {col_definition};"
                    
                    try:
                        cursor.execute(alter_query)
                        print(f"     Coluna '{col_name}' adicionada com sucesso.")
                    except pymysql.err.MySQLError as e:
                        print(f"     ERRO ao adicionar coluna '{col_name}': {e}")

        conn.commit()
        print("\nMigração concluída com sucesso!")

    except FileNotFoundError:
        print(f"ERRO: O arquivo 'query_db.sql' não foi encontrado no caminho esperado: {sql_file_path}")
    except Exception as e:
        print(f"Ocorreu um erro durante a migração: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Este script deve ser executado a partir da pasta 'Server'
    # Ex: python run_migrations.py
    run_migrations()
