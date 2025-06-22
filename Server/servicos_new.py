# Server/servicos.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pymysql
from .dependencies import get_current_user
from .utils import get_db_connection
from datetime import datetime

router = APIRouter()

# Modelo para criar um novo serviço
class ServicoCreate(BaseModel):
    nome: str
    descricao: str
    origem: str
    destino: str
    valor: float
    tipo_veiculo_requerido: str

# Modelo para criar uma proposta
class PropostaCreate(BaseModel):
    id_veiculo: int
    valor_proposto: float
    mensagem: Optional[str] = None

# Modelo para exibir uma proposta
class Proposta(PropostaCreate):
    id_proposta: int
    id_prestador: int
    nome_prestador: str
    status: str

@router.post("/servicos", status_code=201)
def create_servico(servico_data: ServicoCreate, current_user: dict = Depends(get_current_user)):
    """
    Cria um novo serviço para o cliente logado.
    """
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Apenas clientes podem criar serviços.")

    cliente_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor()

    # O status do serviço agora é 'Aberto'
    query = """
        INSERT INTO Servicos (ID_Cliente, Descricao, ValorInicialCliente, EnderecoOrigem, EnderecoDestino, Status, DataSolicitacao, Nome, TipoVeiculoRequerido)
        VALUES (%s, %s, %s, %s, %s, 'Aberto', %s, %s, %s)
    """
    
    try:
        cursor.execute(
            query, 
            (cliente_id, 
            servico_data.descricao, 
            servico_data.valor,
            servico_data.origem,
            servico_data.destino,
            datetime.now(),
            servico_data.nome,
            servico_data.tipo_veiculo_requerido)
        )
        new_service_id = cursor.lastrowid
        conn.commit()
    except pymysql.MySQLError as e:
        conn.rollback()
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar o serviço.")
    finally:
        conn.close()

    return {"message": "Serviço criado com sucesso!", "id_servico": new_service_id}


@router.post("/servicos/{servico_id}/propostas", status_code=201)
def create_proposta(servico_id: int, proposta_data: PropostaCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Apenas prestadores podem enviar propostas.")

    prestador_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verifica se o serviço existe e está 'Aberto'
        cursor.execute("SELECT ID_Servico FROM Servicos WHERE ID_Servico = %s AND Status = 'Aberto'", (servico_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não está aberto para propostas.")

        # Insere a nova proposta
        query = """
            INSERT INTO PropostasServico (ID_Servico, ID_Prestador, ID_Veiculo, ValorProposto, Mensagem, Status)
            VALUES (%s, %s, %s, %s, %s, 'Pendente')
        """
        cursor.execute(query, (servico_id, prestador_id, proposta_data.id_veiculo, proposta_data.valor_proposto, proposta_data.mensagem))
        conn.commit()
    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados ao criar proposta: {e}")
    finally:
        conn.close()

    return {"message": "Proposta enviada com sucesso!"}


@router.get("/servicos/{servico_id}/propostas", response_model=List[Proposta])
def get_propostas_for_servico(servico_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Apenas clientes podem ver as propostas.")

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    propostas = []
    try:
        # Verifica se o cliente é o dono do serviço
        cursor.execute("SELECT ID_Cliente FROM Servicos WHERE ID_Servico = %s", (servico_id,))
        servico_owner = cursor.fetchone()
        if not servico_owner or servico_owner['ID_Cliente'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Você não tem permissão para ver propostas para este serviço.")

        query = """
            SELECT p.ID_Proposta, p.ID_Prestador, u.Nome, p.ID_Veiculo, p.ValorProposto, p.Mensagem, p.Status
            FROM PropostasServico p
            JOIN Usuarios u ON p.ID_Prestador = u.ID_Usuario
            WHERE p.ID_Servico = %s
        """
        cursor.execute(query, (servico_id,))
        rows = cursor.fetchall()
        for row in rows:
            propostas.append(Proposta(
                id_proposta=row['ID_Proposta'],
                id_prestador=row['ID_Prestador'],
                nome_prestador=row['Nome'],
                id_veiculo=row['ID_Veiculo'],
                valor_proposto=row['ValorProposto'],
                mensagem=row['Mensagem'],
                status=row['Status']
            ))
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados: {e}")
    finally:
        conn.close()
    
    return propostas


@router.put("/propostas/{proposta_id}/aceitar", status_code=200)
def aceitar_proposta(proposta_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Apenas clientes podem aceitar propostas.")

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        # Pega os detalhes da proposta e verifica se o cliente é o dono do serviço
        query_prop = """
            SELECT p.ID_Servico, p.ID_Prestador, p.ID_Veiculo, p.ValorProposto, s.ID_Cliente
            FROM PropostasServico p
            JOIN Servicos s ON p.ID_Servico = s.ID_Servico
            WHERE p.ID_Proposta = %s
        """
        cursor.execute(query_prop, (proposta_id,))
        proposta = cursor.fetchone()

        if not proposta:
            raise HTTPException(status_code=404, detail="Proposta não encontrada.")
        
        id_servico = proposta['ID_Servico']
        id_prestador = proposta['ID_Prestador']
        id_veiculo = proposta['ID_Veiculo']
        valor_proposto = proposta['ValorProposto']
        id_cliente = proposta['ID_Cliente']
        
        if id_cliente != current_user['id']:
            raise HTTPException(status_code=403, detail="Você não tem permissão para aceitar esta proposta.")

        # Transação: Atualiza serviço, aceita uma proposta e recusa as outras
        # 1. Atualiza o serviço
        query_update_servico = """
            UPDATE Servicos
            SET ID_Prestador_Aceito = %s, ID_Veiculo_Alocado = %s, ValorFinalAcordado = %s, Status = 'Em Andamento'
            WHERE ID_Servico = %s AND Status = 'Aberto'
        """
        cursor.execute(query_update_servico, (id_prestador, id_veiculo, valor_proposto, id_servico))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=409, detail="Este serviço não está mais aberto para aceitação.")

        # 2. Aceita a proposta escolhida
        cursor.execute("UPDATE PropostasServico SET Status = 'Aceita' WHERE ID_Proposta = %s", (proposta_id,))

        # 3. Recusa as outras propostas para o mesmo serviço
        cursor.execute("UPDATE PropostasServico SET Status = 'Recusada' WHERE ID_Servico = %s AND ID_Proposta != %s", (id_servico, proposta_id))

        conn.commit()

    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados: {e}")
    finally:
        conn.close()

    return {"message": "Proposta aceita com sucesso! O serviço está agora em andamento."}


@router.get("/prestador/servicos/{status}", response_model=List[Dict[str, Any]])
def get_prestador_servicos_por_status(status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para prestadores.")

    status_map = {
        "espera": "Aberto",
        "andamento": "Em Andamento",
        "finalizado": "Concluido"
    }
    db_status = status_map.get(status.lower())
    if not db_status:
        raise HTTPException(status_code=400, detail="Status inválido.")

    prestador_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    servicos = []
    try:
        if db_status == 'Aberto':
            query = """
                SELECT s.ID_Servico, s.Nome, s.Descricao, u.Nome as cliente_nome, s.DataSolicitacao as data_criacao, s.EnderecoOrigem, s.EnderecoDestino, s.ValorInicialCliente, s.TipoVeiculoRequerido
                FROM Servicos s
                JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario
                WHERE s.Status = 'Aberto'
            """
            cursor.execute(query)
        else:
            query = """
                SELECT s.ID_Servico, s.Nome, u.Nome as cliente_nome, s.DataSolicitacao, s.Status
                FROM Servicos s
                JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario
                WHERE s.ID_Prestador_Aceito = %s AND s.Status = %s
            """
            cursor.execute(query, (prestador_id, db_status))
        
        rows = cursor.fetchall()
        for row in rows:
            servico_item = {
                "id": row['ID_Servico'],
                "nome": row['Nome'],
                "cliente_nome": row['cliente_nome'],
                "data_servico": str(row['DataSolicitacao'] if 'DataSolicitacao' in row else row['data_criacao']),
                "status": db_status
            }
            if db_status == 'Aberto':
                servico_item.update({
                    "descricao": row['Descricao'],
                    "origem": row['EnderecoOrigem'],
                    "destino": row['EnderecoDestino'],
                    "valor": row['ValorInicialCliente'],
                    "tipo_veiculo": row['TipoVeiculoRequerido']
                })
            servicos.append(servico_item)
            
    except pymysql.MySQLError as e:
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar serviços do prestador.")
    finally:
        conn.close()
        
    return servicos

@router.get("/cliente/servicos/{status}", response_model=List[Dict[str, Any]])
def get_cliente_servicos_por_status(status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para clientes.")

    cliente_id = current_user['id']
    
    status_map = {
        "abertos": ("Aberto",),
        "andamento": ("Em Andamento", "Aguardando Confirmação"),
        "finalizados": ("Concluido", "Cancelado") 
    }
    db_statuses = status_map.get(status.lower())
    if not db_statuses:
        raise HTTPException(status_code=400, detail="Status inválido.")

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    servicos = []
    try:
        placeholders = ','.join(['%s'] * len(db_statuses))
        query = f"""
            SELECT s.ID_Servico, s.Nome, u.Nome as prestador_nome, s.DataSolicitacao, s.Status
            FROM Servicos s
            LEFT JOIN Usuarios u ON s.ID_Prestador_Aceito = u.ID_Usuario
            WHERE s.ID_Cliente = %s AND s.Status IN ({placeholders})
            ORDER BY s.DataSolicitacao DESC
        """
        
        params = [cliente_id] + list(db_statuses)
        
        cursor.execute(query, params)
        
        rows = cursor.fetchall()
        for row in rows:
            servicos.append({
                "id": row['ID_Servico'],
                "nome": row['Nome'],
                "prestador_nome": row['prestador_nome'] or "Aguardando propostas",
                "data_servico": str(row['DataSolicitacao']),
                "status": row['Status']
            })
            
    except pymysql.MySQLError as e:
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar serviços do cliente.")
    finally:
        conn.close()
        
    return servicos

@router.put("/servicos/{servico_id}/finalizar", status_code=200)
def finalizar_servico_prestador(servico_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Apenas prestadores podem finalizar serviços.")

    prestador_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT ID_Servico FROM Servicos WHERE ID_Servico = %s AND ID_Prestador_Aceito = %s AND Status = 'Em Andamento'",
            (servico_id, prestador_id)
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não pode ser finalizado por você.")

        cursor.execute("UPDATE Servicos SET Status = 'Aguardando Confirmação' WHERE ID_Servico = %s", (servico_id,))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Não foi possível atualizar o status do serviço.")

    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao finalizar o serviço: {e}")
    finally:
        conn.close()

    return {"message": "Serviço marcado como finalizado. Aguardando confirmação do cliente."}

@router.put("/servicos/{servico_id}/confirmar", status_code=200)
def confirmar_servico_cliente(servico_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Apenas clientes podem confirmar a finalização.")

    cliente_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT ID_Servico FROM Servicos WHERE ID_Servico = %s AND ID_Cliente = %s AND Status = 'Aguardando Confirmação'",
            (servico_id, cliente_id)
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não está aguardando sua confirmação.")

        # O status final agora é 'Concluido'
        cursor.execute("UPDATE Servicos SET Status = 'Concluido', DataConclusao = %s WHERE ID_Servico = %s", (datetime.now(), servico_id))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Não foi possível confirmar o serviço.")

    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao confirmar o serviço: {e}")
    finally:
        conn.close()

    return {"message": "Serviço confirmado com sucesso! Agora você pode avaliá-lo."}
