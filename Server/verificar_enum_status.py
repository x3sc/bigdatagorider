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
        print("=== VERIFICAÇÃO DOS VALORES DO ENUM STATUS ===")
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar os valores válidos do ENUM Status
        cursor.execute("SHOW COLUMNS FROM Servicos LIKE 'Status'")
        result = cursor.fetchone()
        print(f"ENUM Status na tabela: {result[1]}")
        
        # Extrair valores individuais do ENUM
        enum_values = result[1]
        # Remove 'enum(' e ')' e divide por vírgulas
        values_str = enum_values.replace("enum(", "").replace(")", "")
        individual_values = [v.strip().strip("'") for v in values_str.split(",")]
        
        print(f"\nValores válidos do ENUM:")
        for i, value in enumerate(individual_values, 1):
            print(f"  {i}. '{value}'")
        
        print(f"\n=== VERIFICANDO USO NO CÓDIGO ===")
        
        # Status usados no prestador.py
        print(f"\nStatus usados em prestador.py:")
        prestador_status = [
            "Em Andamento",      # Para verificação de serviços aceitos
            "Aguardando Confirmação",  # Para finalização pelo prestador
            "Concluido",         # Para serviços finalizados
            "Finalizado"         # Para serviços finalizados (pode estar incorreto)
        ]
        
        for status in prestador_status:
            if status in individual_values:
                print(f"  ✅ '{status}' - VÁLIDO")
            else:
                print(f"  ❌ '{status}' - INVÁLIDO (não existe no ENUM)")
        
        # Status usados no servicos.py
        print(f"\nStatus usados em servicos.py:")
        servicos_status = [
            "Aberto",            # Status inicial
            "Em Andamento",      # Quando proposta é aceita
            "Aguardando Confirmação",  # Quando prestador finaliza
            "Concluido",         # Quando cliente confirma
            "Finalizado",        # Pode estar incorreto
            "Cancelado"          # Para cancelamentos
        ]
        
        for status in servicos_status:
            if status in individual_values:
                print(f"  ✅ '{status}' - VÁLIDO")
            else:
                print(f"  ❌ '{status}' - INVÁLIDO (não existe no ENUM)")
        
        print(f"\n=== MAPEAMENTOS ATUAIS ===")
        
        print(f"\nCliente status_map:")
        cliente_map = {
            "abertos": ("Aberto",),
            "andamento": ("Em Andamento", "Aguardando Confirmação"),
            "finalizados": ("Concluido", "Finalizado"),
            "cancelado": ("Cancelado",)
        }
        
        for key, statuses in cliente_map.items():
            print(f"  {key}: {statuses}")
            for status in statuses:
                if status in individual_values:
                    print(f"    ✅ '{status}' - VÁLIDO")
                else:
                    print(f"    ❌ '{status}' - INVÁLIDO")
        
        print(f"\nPrestador status_map:")
        prestador_map = {
            "aceitos": ("Em Andamento", "Aguardando Confirmação"),
            "finalizados": ("Concluido",),
            "cancelados": ("Cancelado",)
        }
        
        for key, statuses in prestador_map.items():
            print(f"  {key}: {statuses}")
            for status in statuses:
                if status in individual_values:
                    print(f"    ✅ '{status}' - VÁLIDO")
                else:
                    print(f"    ❌ '{status}' - INVÁLIDO")
        
        print(f"\n=== RECOMENDAÇÕES ===")
        print(f"1. Remover todas as referências a 'Finalizado' (usar apenas 'Concluido')")
        print(f"2. Padronizar os status_map para usar apenas valores válidos do ENUM")
        print(f"3. Verificar se o frontend está tratando 'Concluido' corretamente")
        
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
