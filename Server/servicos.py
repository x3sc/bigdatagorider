# Server/servicos.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Servico(BaseModel):
    id: int
    nome: str
    descricao: str
    preco_estimado: float

# Dados de exemplo
mock_servicos = [
    {"id": 1, "nome": "Transporte Executivo", "descricao": "Viagens confortáveis em carros sedan.", "preco_estimado": 150.0},
    {"id": 2, "nome": "Entrega Rápida", "descricao": "Entrega de documentos e pequenos pacotes com motocicleta.", "preco_estimado": 35.0},
    {"id": 3, "nome": "Aluguel de Carro com Motorista", "descricao": "Disponibilidade por hora ou diária.", "preco_estimado": 80.0},
]

@router.get("/servicos", response_model=List[Servico])
def get_all_servicos():
    """
    Retorna uma lista de todos os serviços disponíveis.
    Atualmente, usa dados de exemplo (mock).
    """
    # No futuro, esta função buscará os dados da tabela 'Servicos' no banco.
    return mock_servicos
