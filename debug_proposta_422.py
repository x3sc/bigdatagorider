import requests
import json

def test_proposta_error():
    """Testa especificamente o erro 422 na criação de propostas"""
    
    print("🔍 Investigando erro 422 nas propostas...")
    BASE_URL = "http://127.0.0.1:5000/api"
    
    # 1. Login como prestador
    print("\n🔑 1. Fazendo login como prestador...")
    login_data = {
        "email": "prestador.frontend@exemplo.com",
        "password": "123456",
        "tipo": 1  # Prestador
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            print("   ✅ Login OK")
        else:
            print(f"   ❌ Erro no login: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # 2. Verificar se temos veículos cadastrados
    print("\n🚗 2. Verificando veículos do prestador...")
    try:
        response = requests.get(f"{BASE_URL}/prestador/veiculos", headers=headers)
        if response.status_code == 200:
            veiculos = response.json()
            print(f"   ✅ {len(veiculos)} veículos encontrados")
            if len(veiculos) == 0:
                print("   ⚠️ Nenhum veículo encontrado! Cadastrando um...")
                # Cadastrar veículo
                veiculo_data = {
                    "placa": "DEF-5678",
                    "tipo": "Caminhão",
                    "ano_fabricacao": 2021,
                    "capacidade_toneladas": 3.0
                }
                
                veiculo_response = requests.post(f"{BASE_URL}/prestador/veiculos", json=veiculo_data, headers=headers)
                if veiculo_response.status_code == 201:
                    print("   ✅ Veículo cadastrado!")
                    # Buscar veículos novamente
                    response = requests.get(f"{BASE_URL}/prestador/veiculos", headers=headers)
                    veiculos = response.json()
                else:
                    print(f"   ❌ Erro ao cadastrar veículo: {veiculo_response.text}")
                    
            for veiculo in veiculos:
                print(f"      - ID: {veiculo['id']} | {veiculo['tipo']} | {veiculo['placa']}")
        else:
            print(f"   ❌ Erro ao buscar veículos: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    # 3. Verificar serviços disponíveis
    print("\n📋 3. Verificando serviços disponíveis...")
    try:
        response = requests.get(f"{BASE_URL}/prestador/servicos/espera", headers=headers)
        if response.status_code == 200:
            servicos = response.json()
            print(f"   ✅ {len(servicos)} serviços encontrados")
            if len(servicos) == 0:
                print("   ⚠️ Nenhum serviço encontrado!")
                return
            
            # Mostrar detalhes do primeiro serviço
            servico = servicos[0]
            print(f"   📝 Primeiro serviço: ID {servico['id']} - {servico['nome']}")
            print(f"      Quantidade necessária: {servico.get('quantidade_veiculos', 1)} veículo(s)")
        else:
            print(f"   ❌ Erro ao buscar serviços: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return
    
    # 4. Tentar enviar proposta (reproduzir erro 422)
    print("\n🚚 4. Enviando proposta...")
    
    if len(veiculos) > 0 and len(servicos) > 0:
        servico_id = servicos[0]['id']
        veiculo_id = veiculos[0]['id']
        
        # Primeiro teste: formato correto
        proposta_data = {
            "veiculos_ids": [veiculo_id],
            "valor_proposto": 250.0,
            "mensagem": "Proposta de teste"
        }
        
        print(f"   Enviando para serviço ID: {servico_id}")
        print(f"   Dados da proposta: {json.dumps(proposta_data, indent=2)}")
        
        try:
            response = requests.post(f"{BASE_URL}/servicos/{servico_id}/propostas", 
                                   json=proposta_data, headers=headers)
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 201:
                print("   ✅ Proposta enviada com sucesso!")
            elif response.status_code == 422:
                print("   ❌ Erro 422 reproduzido!")
                print(f"   Detalhes: {response.text}")
                
                # Tentar analisar o erro
                try:
                    error_detail = response.json()
                    print(f"   Erro JSON: {json.dumps(error_detail, indent=2)}")
                except:
                    print("   Não foi possível parsear o erro como JSON")
            else:
                print(f"   ❌ Outro erro: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Erro de conexão: {e}")
    
    # 5. Testar formatos diferentes de dados
    print("\n🧪 5. Testando diferentes formatos...")
    
    # Teste com dados inválidos para identificar a validação
    test_cases = [
        {
            "name": "Sem veiculos_ids",
            "data": {"valor_proposto": 250.0, "mensagem": "teste"}
        },
        {
            "name": "veiculos_ids vazio", 
            "data": {"veiculos_ids": [], "valor_proposto": 250.0}
        },
        {
            "name": "valor_proposto string",
            "data": {"veiculos_ids": [veiculo_id], "valor_proposto": "250.0"}
        },
        {
            "name": "veiculo_id inválido",
            "data": {"veiculos_ids": [99999], "valor_proposto": 250.0}
        }
    ]
    
    for test_case in test_cases:
        try:
            print(f"\n   Teste: {test_case['name']}")
            response = requests.post(f"{BASE_URL}/servicos/{servico_id}/propostas",
                                   json=test_case['data'], headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 422:
                try:
                    error = response.json()
                    print(f"   Erro: {error}")
                except:
                    print(f"   Erro (texto): {response.text}")
        except Exception as e:
            print(f"   ❌ Erro: {e}")

if __name__ == "__main__":
    test_proposta_error()
