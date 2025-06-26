#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

def test_confirmar_finalizacao():
    # URL do endpoint
    url = "http://127.0.0.1:5000/api/servicos/1205/confirmar-finalizacao"
    
    # Token de autorização (do cliente)
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0ZWNsQHRlc3RlLmNvbSIsInRpcG8iOiJjbGllbnRlIiwiZXhwIjoxNzUwOTc3MTMwfQ.xgES6tFe2YYBVIfjrSOHhkFM2x30I809Z-AJXVsDk8c"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print("Testando endpoint de confirmação de finalização pelo cliente...")
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
    test_confirmar_finalizacao()
