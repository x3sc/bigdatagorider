#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pymysql
from utils import get_db_connection

def verificar_status():
    conn = None
    cursor = None
    try:
        print("Conectando ao banco de dados...")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        print("\n=== VERIFICANDO STATUS DO SERVIÇO 1206 ===")
        cursor.execute("SELECT ID_Servico, Status, ID_Prestador_Aceito, ID_Cliente, Nome FROM Servicos WHERE ID_Servico = 1206")
        servico = cursor.fetchone()
        print(f"Serviço 1206: {servico}")
        
        if servico:
            status = servico[1]
            print(f"Status atual: '{status}'")
            if status == 'Aguardando Confirmação':
                print("✅ Status correto! O serviço está aguardando confirmação do cliente.")
            else:
                print(f"❌ Status inesperado: '{status}'")
        else:
            print("❌ Serviço 1206 não encontrado!")
            
    except Exception as e:
        print(f"ERRO: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Conexão fechada")

if __name__ == "__main__":
    verificar_status()
