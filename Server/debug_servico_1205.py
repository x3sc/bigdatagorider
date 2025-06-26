#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pymysql
from utils import get_db_connection

def debug_servico_1205():
    conn = None
    cursor = None
    try:
        print("=== DEBUG SERVIÇO 1205 ===")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar se o serviço 1205 existe
        print("\n1. Verificando serviço 1205...")
        cursor.execute("SELECT ID_Servico, Status, ID_Cliente, ID_Prestador_Aceito, Nome FROM Servicos WHERE ID_Servico = 1205")
        servico = cursor.fetchone()
        print(f"   Serviço 1205: {servico}")
        
        if servico:
            servico_id, status, cliente_id, prestador_id, nome = servico
            print(f"   - ID: {servico_id}")
            print(f"   - Status: '{status}'")
            print(f"   - Cliente ID: {cliente_id}")
            print(f"   - Prestador ID: {prestador_id}")
            print(f"   - Nome: {nome}")
            
            # Verificar se está no status correto para confirmação
            if status == 'Aguardando Confirmação':
                print("   ✅ Status correto para confirmação")
            else:
                print(f"   ❌ Status incorreto: '{status}' (deveria ser 'Aguardando Confirmação')")
                
                # Corrigir o status para teste
                print("\n2. Corrigindo status para 'Aguardando Confirmação'...")
                cursor.execute("UPDATE Servicos SET Status = 'Aguardando Confirmação' WHERE ID_Servico = 1205")
                conn.commit()
                print("   Status corrigido!")
        else:
            print("   ❌ Serviço 1205 não encontrado!")
            
    except Exception as e:
        print(f"ERRO: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("\nConexão fechada")

if __name__ == "__main__":
    debug_servico_1205()
