#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

def test_finalizar_servico():
    # URL do endpoint
    url = "http://127.0.0.1:5000/api/prestador/servicos/1206/finalizar"
    
    # Token de autorização (do prestador)
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJ0ZXN0ZXByZXNAdGVzdGUuY29tIiwidGlwbyI6InByZXN0YWRvciIsImV4cCI6MTc1MDk3NjI0NH0.hwznArJxYzMafVbkMj_Q7EdJL59slfA6NhSYtemlzaU"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print("Testando endpoint de finalização de serviço...")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        
        response = requests.put(url, headers=headers)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"Sucesso! Response: {response.json()}")
        else:
            print(f"Erro! Response: {response.text}")
            
    except Exception as e:
        print(f"Erro na requisição: {e}")

if __name__ == "__main__":
    test_finalizar_servico()
