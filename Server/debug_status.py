#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pymysql
from utils import get_db_connection

def main():
    conn = None
    cursor = None
    try:
        print("Conectando ao banco de dados...")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        print("\n=== VERIFICANDO ESTRUTURA DA TABELA SERVICOS ===")
        
        # Verifica os valores do ENUM Status
        cursor.execute("SHOW COLUMNS FROM Servicos LIKE 'Status'")
        result = cursor.fetchone()
        print(f"Definição da coluna Status: {result}")
        
        # Verifica o serviço 1206 específico
        print(f"\n=== VERIFICANDO SERVIÇO 1206 ===")
        cursor.execute("SELECT ID_Servico, Status, ID_Prestador_Aceito, ID_Cliente, Nome FROM Servicos WHERE ID_Servico = 1206")
        servico = cursor.fetchone()
        print(f"Serviço 1206: {servico}")
        
        if servico:
            print(f"\n=== TESTANDO UPDATE COM 'Aguardando Confirmação' ===")
            # Tenta fazer o update com o valor correto do ENUM
            cursor.execute("UPDATE Servicos SET Status = %s WHERE ID_Servico = %s", ('Aguardando Confirmação', 1206))
            print(f"Linhas afetadas pelo UPDATE: {cursor.rowcount}")
            
            # Verifica se funcionou
            cursor.execute("SELECT ID_Servico, Status FROM Servicos WHERE ID_Servico = 1206")
            result = cursor.fetchone()
            print(f"Status após UPDATE: {result}")
            
            # Confirma a transação
            conn.commit()
            print("UPDATE realizado com sucesso!")
            
            # Volta o status para 'Em Andamento' para testar novamente
            print(f"\n=== VOLTANDO STATUS PARA 'Em Andamento' ===")
            cursor.execute("UPDATE Servicos SET Status = %s WHERE ID_Servico = %s", ('Em Andamento', 1206))
            conn.commit()
            print("Status voltou para 'Em Andamento'")
        else:
            print("Serviço 1206 não encontrado!")
            
    except Exception as e:
        print(f"ERRO: {e}")
        if conn:
            conn.rollback()
            print("Transação revertida devido ao erro")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Conexão fechada")

if __name__ == "__main__":
    main()
