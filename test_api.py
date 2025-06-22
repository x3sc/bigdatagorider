import requests
import json

# Teste simples da API
BASE_URL = "http://127.0.0.1:5000/api"

def test_api():
    """Testa se a API está respondendo corretamente"""
    
    print("🔍 Testando API...")
    
    # 1. Teste endpoint raiz
    try:
        response = requests.get("http://127.0.0.1:5000/")
        print(f"✅ Endpoint raiz: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Erro no endpoint raiz: {e}")
    
    # 2. Teste de criação de serviço sem token (deve dar 401)
    try:
        servico_data = {
            "nome": "Teste",
            "descricao": "Serviço de teste",
            "origem": "Origem teste",
            "destino": "Destino teste",
            "valor": 100.0,
            "tipo_veiculo_requerido": "Caminhão",
            "data_servico": "2025-01-15",
            "quantidade_veiculos": 1
        }
        
        response = requests.post(f"{BASE_URL}/servicos", json=servico_data)
        print(f"🔐 Teste sem token (esperado 401): {response.status_code}")
        if response.status_code == 401:
            print("✅ Autenticação funcionando corretamente")
        else:
            print(f"⚠️ Status inesperado: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro no teste de serviços: {e}")
    
    # 3. Teste de documentação
    try:
        response = requests.get("http://127.0.0.1:5000/docs")
        if response.status_code == 200:
            print("✅ Documentação da API acessível")
        else:
            print(f"❌ Erro na documentação: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na documentação: {e}")

if __name__ == "__main__":
    test_api()
