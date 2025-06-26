#!/usr/bin/env python3
import pymysql
from utils import get_db_connection

def test_database():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Buscar um cliente de teste
        print("Buscando clientes...")
        cursor.execute("SELECT ID_Usuario, Nome, Email FROM Usuarios WHERE Tipo = 'cliente' LIMIT 5")
        clientes = cursor.fetchall()
        
        if clientes:
            print(f"Clientes encontrados: {len(clientes)}")
            for cliente in clientes:
                print(f"  - ID: {cliente[0]}, Nome: {cliente[1]}, Email: {cliente[2]}")
        else:
            print("Nenhum cliente encontrado")

        # Buscar prestadores
        print("\nBuscando prestadores...")
        cursor.execute("SELECT ID_Usuario, Nome, Email FROM Usuarios WHERE Tipo = 'prestador' LIMIT 5")
        prestadores = cursor.fetchall()
        
        if prestadores:
            print(f"Prestadores encontrados: {len(prestadores)}")
            for prestador in prestadores:
                print(f"  - ID: {prestador[0]}, Nome: {prestador[1]}, Email: {prestador[2]}")
        else:
            print("Nenhum prestador encontrado")

        # Buscar serviços
        print("\nBuscando serviços...")
        cursor.execute("SELECT ID_Servico, Nome, Status FROM Servicos LIMIT 5")
        servicos = cursor.fetchall()
        
        if servicos:
            print(f"Serviços encontrados: {len(servicos)}")
            for servico in servicos:
                print(f"  - ID: {servico[0]}, Nome: {servico[1]}, Status: {servico[2]}")
        else:
            print("Nenhum serviço encontrado")

        conn.close()
    except Exception as e:
        print(f"Erro ao conectar com o banco: {e}")

if __name__ == "__main__":
    test_database()
