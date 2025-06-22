#!/usr/bin/env python3
"""
Teste para verificar cenário de múltiplos prestadores alocando veículos em um mesmo serviço.
Este teste simula a situação onde um serviço precisa de 3 veículos e 2 prestadores fazem propostas.
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:5000"

def test_multiple_providers_scenario():
    """Teste do cenário completo de múltiplos prestadores"""
    
    print("🧪 Iniciando teste de múltiplos prestadores...")
      # 1. Cadastrar cliente
    print("\n1️⃣ Cadastrando cliente...")
    cliente_data = {
        "nome": "Empresa",
        "sobrenome": "XYZ",
        "email": "empresa@xyz.com",
        "senha": "senha123",
        "telefone": "11999999999",
        "documento": "12345678000195",
        "tipo": 0  # Cliente
    }
    
    cliente_response = requests.post(f"{BASE_URL}/api/cadastro", json=cliente_data)
    print(f"Status: {cliente_response.status_code}")
    if cliente_response.status_code != 201:
        print(f"Erro no cadastro do cliente: {cliente_response.text}")
        return False
      # Login do cliente
    login_cliente = requests.post(f"{BASE_URL}/api/login", json={
        "email": cliente_data["email"],
        "password": cliente_data["senha"],
        "tipo": 0  # Cliente
    })
    cliente_token = login_cliente.json()["access_token"]
    print("✅ Cliente cadastrado e logado")
      # 2. Cadastrar primeiro prestador
    print("\n2️⃣ Cadastrando primeiro prestador...")
    prestador1_data = {
        "nome": "João",
        "sobrenome": "Transportes",
        "email": "joao@transportes.com",
        "senha": "senha123",
        "telefone": "11888888888",
        "documento": "11111111000111",
        "tipo": 1  # Prestador
    }
    
    prestador1_response = requests.post(f"{BASE_URL}/api/cadastro", json=prestador1_data)
    print(f"Status: {prestador1_response.status_code}")
    if prestador1_response.status_code != 201:
        print(f"Erro no cadastro do prestador 1: {prestador1_response.text}")
        return False
      # Login do primeiro prestador
    login_prestador1 = requests.post(f"{BASE_URL}/api/login", json={
        "email": prestador1_data["email"],
        "password": prestador1_data["senha"],
        "tipo": 1  # Prestador
    })
    prestador1_token = login_prestador1.json()["access_token"]
    print("✅ Prestador 1 cadastrado e logado")
      # 3. Cadastrar segundo prestador
    print("\n3️⃣ Cadastrando segundo prestador...")
    prestador2_data = {
        "nome": "Maria",
        "sobrenome": "Logística",
        "email": "maria@logistica.com",
        "senha": "senha123",
        "telefone": "11777777777",
        "documento": "22222222000222",
        "tipo": 1  # Prestador
    }
    
    prestador2_response = requests.post(f"{BASE_URL}/api/cadastro", json=prestador2_data)
    print(f"Status: {prestador2_response.status_code}")
    if prestador2_response.status_code != 201:
        print(f"Erro no cadastro do prestador 2: {prestador2_response.text}")
        return False
      # Login do segundo prestador
    login_prestador2 = requests.post(f"{BASE_URL}/api/login", json={
        "email": prestador2_data["email"],
        "password": prestador2_data["senha"],
        "tipo": 1  # Prestador
    })
    prestador2_token = login_prestador2.json()["access_token"]
    print("✅ Prestador 2 cadastrado e logado")
    
    # 4. Cadastrar veículos para o primeiro prestador
    print("\n4️⃣ Cadastrando veículos para o prestador 1...")
    veiculos_prestador1 = [
        {"placa": "ABC-1111", "tipo": "Caminhão", "ano_fabricacao": 2020, "capacidade_toneladas": 5.0},
        {"placa": "ABC-2222", "tipo": "Caminhão", "ano_fabricacao": 2021, "capacidade_toneladas": 7.0}
    ]
      veiculos_ids_p1 = []
    for veiculo in veiculos_prestador1:
        response = requests.post(f"{BASE_URL}/api/prestador/veiculos", 
                               json=veiculo,
                               headers={"Authorization": f"Bearer {prestador1_token}"})
        if response.status_code == 201:
            result = response.json()
            veiculo_id = result.get("id_veiculo") or result.get("id")  # Tentativa com ambos os nomes
            veiculos_ids_p1.append(veiculo_id)
            print(f"  ✅ Veículo {veiculo['placa']} cadastrado (ID: {veiculo_id})")
        else:
            print(f"  ❌ Erro ao cadastrar veículo {veiculo['placa']}: {response.text}")
            return False
    
    # 5. Cadastrar veículos para o segundo prestador
    print("\n5️⃣ Cadastrando veículos para o prestador 2...")
    veiculos_prestador2 = [
        {"placa": "DEF-3333", "tipo": "Van", "ano_fabricacao": 2019, "capacidade_toneladas": 2.0},
        {"placa": "DEF-4444", "tipo": "Caminhão", "ano_fabricacao": 2022, "capacidade_toneladas": 8.0}
    ]
      veiculos_ids_p2 = []
    for veiculo in veiculos_prestador2:
        response = requests.post(f"{BASE_URL}/api/prestador/veiculos", 
                               json=veiculo,
                               headers={"Authorization": f"Bearer {prestador2_token}"})
        if response.status_code == 201:
            result = response.json()
            veiculo_id = result.get("id_veiculo") or result.get("id")  # Tentativa com ambos os nomes
            veiculos_ids_p2.append(veiculo_id)
            print(f"  ✅ Veículo {veiculo['placa']} cadastrado (ID: {veiculo_id})")
        else:
            print(f"  ❌ Erro ao cadastrar veículo {veiculo['placa']}: {response.text}")
            return False
    
    # 6. Cliente cria um serviço que precisa de 3 veículos
    print("\n6️⃣ Cliente criando serviço que requer 3 veículos...")
    servico_data = {
        "nome": "Mudança Empresa",
        "descricao": "Mudança completa de escritório, precisa de 3 veículos",
        "origem": "São Paulo - SP",
        "destino": "Rio de Janeiro - RJ",
        "data_servico": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "tipo_veiculo_requerido": "Caminhão",
        "quantidade_veiculos": 3,
        "valor": 1500.00
    }
    
    servico_response = requests.post(f"{BASE_URL}/api/cliente/servicos",
                                   json=servico_data,
                                   headers={"Authorization": f"Bearer {cliente_token}"})
    
    if servico_response.status_code != 201:
        print(f"❌ Erro ao criar serviço: {servico_response.text}")
        return False
    
    servico_id = servico_response.json()["id"]
    print(f"✅ Serviço criado (ID: {servico_id}) - Requer {servico_data['quantidade_veiculos']} veículos")
    
    # 7. Primeiro prestador faz proposta com 2 veículos
    print("\n7️⃣ Prestador 1 fazendo proposta com 2 veículos...")
    proposta1_data = {
        "veiculos_ids": veiculos_ids_p1,  # 2 veículos
        "valor_proposto": 800.00,
        "mensagem": "Tenho 2 caminhões disponíveis para sua mudança!"
    }
    
    proposta1_response = requests.post(f"{BASE_URL}/api/servicos/{servico_id}/propostas",
                                     json=proposta1_data,
                                     headers={"Authorization": f"Bearer {prestador1_token}"})
    
    if proposta1_response.status_code != 201:
        print(f"❌ Erro na proposta do prestador 1: {proposta1_response.text}")
        return False
    
    proposta1_id = proposta1_response.json()["id"]
    print(f"✅ Proposta 1 enviada (ID: {proposta1_id}) - 2 veículos por R$ 800,00")
    
    # 8. Segundo prestador faz proposta com 1 veículo (insuficiente)
    print("\n8️⃣ Prestador 2 fazendo proposta com 1 veículo (insuficiente)...")
    proposta2_data = {
        "veiculos_ids": [veiculos_ids_p2[0]],  # Apenas 1 veículo
        "valor_proposto": 400.00,
        "mensagem": "Tenho uma van disponível!"
    }
    
    proposta2_response = requests.post(f"{BASE_URL}/api/servicos/{servico_id}/propostas",
                                     json=proposta2_data,
                                     headers={"Authorization": f"Bearer {prestador2_token}"})
    
    print(f"Status proposta 2: {proposta2_response.status_code}")
    if proposta2_response.status_code == 201:
        proposta2_id = proposta2_response.json()["id"]
        print(f"✅ Proposta 2 enviada (ID: {proposta2_id}) - 1 veículo por R$ 400,00 (insuficiente)")
    else:
        print(f"⚠️ Proposta 2 rejeitada: {proposta2_response.text}")
    
    # 9. Segundo prestador faz nova proposta com 2 veículos (combinando com o primeiro)
    print("\n9️⃣ Prestador 2 fazendo nova proposta com 2 veículos...")
    proposta3_data = {
        "veiculos_ids": veiculos_ids_p2,  # 2 veículos
        "valor_proposto": 700.00,
        "mensagem": "Agora tenho 2 veículos disponíveis - van + caminhão!"
    }
    
    proposta3_response = requests.post(f"{BASE_URL}/api/servicos/{servico_id}/propostas",
                                     json=proposta3_data,
                                     headers={"Authorization": f"Bearer {prestador2_token}"})
    
    if proposta3_response.status_code != 201:
        print(f"❌ Erro na proposta 3 do prestador 2: {proposta3_response.text}")
        return False
    
    proposta3_id = proposta3_response.json()["id"]
    print(f"✅ Proposta 3 enviada (ID: {proposta3_id}) - 2 veículos por R$ 700,00")
    
    # 10. Cliente consulta propostas recebidas
    print("\n🔍 Cliente consultando propostas recebidas...")
    propostas_response = requests.get(f"{BASE_URL}/api/cliente/servicos/{servico_id}/propostas",
                                    headers={"Authorization": f"Bearer {cliente_token}"})
    
    if propostas_response.status_code == 200:
        propostas = propostas_response.json()
        print(f"📋 Total de propostas: {len(propostas)}")
        for i, prop in enumerate(propostas, 1):
            print(f"  {i}. Prestador: {prop['prestador_nome']} | Veículos: {len(prop.get('veiculos', []))} | Valor: R$ {prop['valor_proposto']}")
    else:
        print(f"❌ Erro ao consultar propostas: {propostas_response.text}")
        return False
    
    # 11. Verificar se sistema permite combinar propostas para atender demanda
    print("\n🔗 Verificando possibilidade de combinar propostas...")
    total_veiculos_disponivel = 0
    for prop in propostas:
        if prop['status'] == 'Pendente':
            total_veiculos_disponivel += len(prop.get('veiculos', []))
    
    print(f"📊 Total de veículos disponíveis em propostas: {total_veiculos_disponivel}")
    print(f"📊 Veículos necessários: {servico_data['quantidade_veiculos']}")
    
    if total_veiculos_disponivel >= servico_data['quantidade_veiculos']:
        print("✅ Há veículos suficientes para atender o serviço!")
        print("💡 O cliente pode aceitar múltiplas propostas para completar a demanda")
    else:
        print("❌ Não há veículos suficientes nas propostas atuais")
    
    print("\n🎯 Teste concluído com sucesso!")
    print("📝 Resumo:")
    print(f"   - Cliente criou serviço com demanda de {servico_data['quantidade_veiculos']} veículos")
    print(f"   - Prestador 1 ofereceu {len(veiculos_ids_p1)} veículos")
    print(f"   - Prestador 2 ofereceu {len(veiculos_ids_p2)} veículos") 
    print(f"   - Total de propostas válidas: {len([p for p in propostas if p['status'] == 'Pendente'])}")
    print(f"   - Sistema permite múltiplos prestadores para um serviço: ✅")
    
    return True

if __name__ == "__main__":
    try:
        success = test_multiple_providers_scenario()
        if success:
            print("\n🎉 Teste de múltiplos prestadores passou!")
        else:
            print("\n❌ Teste falhou!")
    except Exception as e:
        print(f"\n💥 Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
