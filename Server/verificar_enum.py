#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pymysql
from utils import get_db_connection

def verificar_enum_status():
    conn = None
    cursor = None
    try:
        print("=== VERIFICANDO ENUM STATUS ===")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SHOW COLUMNS FROM Servicos LIKE "Status"')
        result = cursor.fetchone()
        print(f'ENUM Status: {result[1]}')
        
        # Extrair os valores do ENUM
        enum_str = result[1]
        print(f"\nValores válidos do ENUM:")
        
        # Parse dos valores do ENUM
        if "enum(" in enum_str:
            valores = enum_str.replace("enum(", "").replace(")", "").replace("'", "").split(",")
            for i, valor in enumerate(valores, 1):
                print(f"  {i}. '{valor}'")
        
        # Verificar se 'Finalizado' existe
        if "'Finalizado'" in enum_str:
            print("\n✅ 'Finalizado' existe no ENUM")
        else:
            print("\n❌ 'Finalizado' NÃO existe no ENUM")
            print("   O endpoint está tentando usar 'Finalizado' mas deveria usar 'Concluido'")
            
    except Exception as e:
        print(f"ERRO: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("\nConexão fechada")

if __name__ == "__main__":
    verificar_enum_status()
