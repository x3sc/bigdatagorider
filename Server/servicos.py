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
    data_servico: str  # Data no formato 'YYYY-MM-DD'
    quantidade_veiculos: int = 1  # NOVO CAMPO

# Modelo para criar uma proposta
class PropostaCreate(BaseModel):
    veiculos_ids: List[int]  # MODIFICADO: Lista de veículos
    valor_proposto: float
    mensagem: Optional[str] = None

# Modelo para exibir uma proposta
class Proposta(BaseModel):
    id_proposta: int
    id_prestador: int
    nome_prestador: str
    valor_proposto: float
    mensagem: Optional[str] = None
    status: str
    veiculos: List[Dict[str, Any]] = []  # NOVO: Lista de veículos

# Modelo para criar veículo
class VeiculoCreate(BaseModel):
    placa: str
    tipo: str
    ano_fabricacao: int
    capacidade_toneladas: float

# Modelo para cancelamento de serviço
class CancelamentoData(BaseModel):
    cancelado_por: str  # 'cliente' ou 'prestador'
    motivo_cancelamento: Optional[str] = None

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
        INSERT INTO Servicos (ID_Cliente, Descricao, ValorInicialCliente, EnderecoOrigem, EnderecoDestino, Status, DataSolicitacao, Nome, TipoVeiculoRequerido, DataServico, QuantidadeVeiculos)
        VALUES (%s, %s, %s, %s, %s, 'Aberto', %s, %s, %s, %s, %s)
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
            servico_data.tipo_veiculo_requerido,
            servico_data.data_servico,
            servico_data.quantidade_veiculos)  # NOVO CAMPO
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
        cursor.execute("SELECT ID_Servico, QuantidadeVeiculos FROM Servicos WHERE ID_Servico = %s AND Status = 'Aberto'", (servico_id,))
        servico = cursor.fetchone()
        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não está aberto para propostas.")
        
        quantidade_necessaria = servico[1]
        
        # Verifica se a quantidade de veículos oferecidos é suficiente
        if len(proposta_data.veiculos_ids) < quantidade_necessaria:
            raise HTTPException(status_code=400, detail=f"Este serviço requer pelo menos {quantidade_necessaria} veículo(s).")

        # Verifica se todos os veículos pertencem ao prestador e estão disponíveis
        placeholders = ','.join(['%s'] * len(proposta_data.veiculos_ids))
        cursor.execute(f"""
            SELECT ID_Veiculo, Placa, Tipo FROM Veiculos 
            WHERE ID_Veiculo IN ({placeholders}) AND ID_Prestador = %s AND Status = 'Disponivel'
        """, proposta_data.veiculos_ids + [prestador_id])
        
        veiculos_disponiveis = cursor.fetchall()
        if len(veiculos_disponiveis) != len(proposta_data.veiculos_ids):
            raise HTTPException(status_code=400, detail="Um ou mais veículos não estão disponíveis ou não pertencem a você.")

        # Insere a nova proposta
        query_proposta = """
            INSERT INTO PropostasServico (ID_Servico, ID_Prestador, ValorProposto, Mensagem, Status)
            VALUES (%s, %s, %s, %s, 'Pendente')
        """
        cursor.execute(query_proposta, (servico_id, prestador_id, proposta_data.valor_proposto, proposta_data.mensagem))
        proposta_id = cursor.lastrowid

        # Insere os veículos da proposta
        for veiculo_id in proposta_data.veiculos_ids:
            cursor.execute("""
                INSERT INTO PropostaVeiculos (ID_Proposta, ID_Veiculo)
                VALUES (%s, %s)
            """, (proposta_id, veiculo_id))

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

        # Busca propostas com informações do prestador
        query = """
            SELECT p.ID_Proposta, p.ID_Prestador, u.Nome, p.ValorProposto, p.Mensagem, p.Status
            FROM PropostasServico p
            JOIN Usuarios u ON p.ID_Prestador = u.ID_Usuario
            WHERE p.ID_Servico = %s
        """
        cursor.execute(query, (servico_id,))
        propostas_rows = cursor.fetchall()
        
        for proposta_row in propostas_rows:
            # Busca veículos da proposta
            cursor.execute("""
                SELECT v.ID_Veiculo, v.Placa, v.Tipo, v.CapacidadeToneladas, v.AnoFabricacao
                FROM PropostaVeiculos pv
                JOIN Veiculos v ON pv.ID_Veiculo = v.ID_Veiculo
                WHERE pv.ID_Proposta = %s
            """, (proposta_row['ID_Proposta'],))
            veiculos = cursor.fetchall()
            
            propostas.append(Proposta(
                id_proposta=proposta_row['ID_Proposta'],
                id_prestador=proposta_row['ID_Prestador'],
                nome_prestador=proposta_row['Nome'],
                valor_proposto=proposta_row['ValorProposto'],
                mensagem=proposta_row['Mensagem'],
                status=proposta_row['Status'],
                veiculos=veiculos
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
            SELECT p.ID_Servico, p.ID_Prestador, p.ValorProposto, s.ID_Cliente
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
        valor_proposto = proposta['ValorProposto']
        id_cliente = proposta['ID_Cliente']
        
        if id_cliente != current_user['id']:
            raise HTTPException(status_code=403, detail="Você não tem permissão para aceitar esta proposta.")

        # Busca os veículos da proposta
        cursor.execute("""
            SELECT pv.ID_Veiculo 
            FROM PropostaVeiculos pv
            WHERE pv.ID_Proposta = %s
        """, (proposta_id,))
        veiculos_proposta = [row['ID_Veiculo'] for row in cursor.fetchall()]

        # Transação: Atualiza serviço, aceita uma proposta, recusa as outras e aloca veículos
        # 1. Atualiza o serviço
        query_update_servico = """
            UPDATE Servicos
            SET ID_Prestador_Aceito = %s, Status = 'Em Andamento'
            WHERE ID_Servico = %s AND Status = 'Aberto'
        """
        cursor.execute(query_update_servico, (id_prestador, id_servico))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=409, detail="Este serviço não está mais aberto para aceitação.")

        # 2. Aceita a proposta escolhida
        cursor.execute("UPDATE PropostasServico SET Status = 'Aceita' WHERE ID_Proposta = %s", (proposta_id,))

        # 3. Recusa as outras propostas para o mesmo serviço
        cursor.execute("UPDATE PropostasServico SET Status = 'Recusada' WHERE ID_Servico = %s AND ID_Proposta != %s", (id_servico, proposta_id))        # 4. Aloca os veículos da proposta aceita ao serviço
        for veiculo_id in veiculos_proposta:
            cursor.execute("""
                INSERT INTO ServicoVeiculos (ID_Servico, ID_Veiculo, ID_Prestador, Status)
                VALUES (%s, %s, %s, 'Alocado')
            """, (id_servico, veiculo_id, id_prestador))

        # 5. IMPORTANTE: Marca os veículos como "Em Servico" na tabela Veiculos
        if veiculos_proposta:
            placeholders = ','.join(['%s'] * len(veiculos_proposta))
            query_marcar_veiculos = f"""
                UPDATE Veiculos 
                SET Status = 'Em Servico'
                WHERE ID_Veiculo IN ({placeholders}) AND Status = 'Disponivel'
            """
            cursor.execute(query_marcar_veiculos, veiculos_proposta)
            
            print(f"DEBUG: {len(veiculos_proposta)} veículos marcados como 'Em Servico' para o serviço {id_servico}")

        conn.commit()

    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados: {e}")
    finally:
        conn.close()

    return {"message": "Proposta aceita com sucesso! O serviço está agora em andamento."}


# ROTA REMOVIDA - Conflitava com endpoints específicos do prestador.py
# Use os endpoints específicos em prestador.py:
# - /api/prestador/propostas/pendentes
# - /api/prestador/servicos/aceitos  
# - /api/prestador/servicos/finalizados


@router.get("/cliente/servicos/{status}", response_model=List[Dict[str, Any]])
def get_cliente_servicos_por_status(status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para clientes.")

    cliente_id = current_user['id']
    
    status_map = {
        "abertos": ("Aberto",),
        "andamento": ("Em Andamento", "Aguardando Confirmação"),
        "finalizados": ("Concluido",),
        "cancelado": ("Cancelado",)
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
            SELECT s.ID_Servico, s.Nome, u.Nome as prestador_nome, s.DataServico, s.Status,
                   s.Cancelado_Por, s.Motivo_Cancelamento, s.Data_Cancelamento
            FROM Servicos s
            LEFT JOIN Usuarios u ON s.ID_Prestador_Aceito = u.ID_Usuario
            WHERE s.ID_Cliente = %s AND s.Status IN ({placeholders})
            ORDER BY s.DataSolicitacao DESC
        """
        
        params = [cliente_id] + list(db_statuses)
        
        cursor.execute(query, params)
        
        rows = cursor.fetchall()
        for row in rows:
            servico_data = {
                "id": row['ID_Servico'],
                "nome": row['Nome'],
                "prestador_nome": row['prestador_nome'] or "Aguardando propostas",
                "data_servico": str(row['DataServico']),
                "status": row['Status']
            }
            
            # Adicionar dados de cancelamento se aplicável
            if row['Status'] == 'Cancelado':
                servico_data.update({
                    "cancelado_por": row['Cancelado_Por'],
                    "motivo_cancelamento": row['Motivo_Cancelamento'],
                    "data_cancelamento": str(row['Data_Cancelamento']) if row['Data_Cancelamento'] else None
                })
            
            servicos.append(servico_data)
            
    except pymysql.MySQLError as e:
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar serviços do cliente.")
    finally:
        conn.close()
        
    return servicos

@router.get("/prestador/servicos/{status}", response_model=List[Dict[str, Any]])
def get_prestador_servicos_por_status(status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para prestadores.")

    prestador_id = current_user['id']
    
    status_map = {
        "aceitos": ("Em Andamento", "Aguardando Confirmação"),
        "finalizados": ("Concluido",),
        "cancelados": ("Cancelado",)
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
            SELECT s.ID_Servico, s.Nome, u.Nome as cliente_nome, s.DataServico, s.Status,
                   s.Cancelado_Por, s.Motivo_Cancelamento, s.Data_Cancelamento,
                   s.EnderecoOrigem, s.EnderecoDestino, s.ValorInicialCliente
            FROM Servicos s
            LEFT JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario
            WHERE s.ID_Prestador_Aceito = %s AND s.Status IN ({placeholders})
            ORDER BY s.DataSolicitacao DESC
        """
        
        params = [prestador_id] + list(db_statuses)
        
        cursor.execute(query, params)
        
        rows = cursor.fetchall()
        for row in rows:
            servico_data = {
                "id": row['ID_Servico'],
                "nome": row['Nome'],
                "cliente_nome": row['cliente_nome'] or "Cliente não informado",
                "data_servico": str(row['DataServico']),
                "status": row['Status'],
                "origem": row['EnderecoOrigem'],
                "destino": row['EnderecoDestino'],
                "valor": f"R$ {row['ValorInicialCliente']:.2f}" if row['ValorInicialCliente'] else "Não informado"
            }
            
            # Adicionar dados de cancelamento se aplicável
            if row['Status'] == 'Cancelado':
                servico_data.update({
                    "cancelado_por": row['Cancelado_Por'],
                    "motivo_cancelamento": row['Motivo_Cancelamento'],
                    "data_cancelamento": str(row['Data_Cancelamento']) if row['Data_Cancelamento'] else None
                })
            
            servicos.append(servico_data)
            
    except pymysql.MySQLError as e:
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar serviços do prestador.")
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

        # Buscar os veículos alocados ao serviço para liberá-los
        cursor.execute("""
            SELECT ID_Veiculo FROM ServicoVeiculos 
            WHERE ID_Servico = %s AND Status = 'Alocado'
        """, (servico_id,))
        veiculos_alocados = [row[0] for row in cursor.fetchall()]

        # Atualizar o status do serviço para 'Aguardando Confirmação'
        cursor.execute("UPDATE Servicos SET Status = 'Aguardando Confirmação' WHERE ID_Servico = %s", (servico_id,))
        
        # NÃO liberar os veículos aqui - eles devem permanecer "Em Servico" até a confirmação do cliente
        print(f"DEBUG: Serviço {servico_id} marcado como 'Aguardando Confirmação'. Veículos {veiculos_alocados} permanecem 'Em Servico' até confirmação do cliente.")

        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Não foi possível atualizar o status do serviço.")

    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao finalizar o serviço: {e}")
    finally:
        conn.close()

    return {"message": "Serviço marcado como finalizado. Aguardando confirmação do cliente para liberar os veículos."}

@router.put("/servicos/{servico_id}/confirmar", status_code=200)
def confirmar_servico_cliente(servico_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Apenas clientes podem confirmar a finalização.")

    cliente_id = current_user['id']
    print(f"DEBUG /confirmar: Cliente ID {cliente_id} tentando confirmar serviço ID {servico_id}")
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verificar se o serviço existe e quem é o dono
        cursor.execute("SELECT ID_Cliente, Status FROM Servicos WHERE ID_Servico = %s", (servico_id,))
        servico_info = cursor.fetchone()
        
        if servico_info:
            print(f"DEBUG: Serviço encontrado - Cliente dono: {servico_info[0]}, Status: {servico_info[1]}")
        else:
            print(f"DEBUG: Serviço ID {servico_id} não encontrado")
        
        cursor.execute(
            "SELECT ID_Servico FROM Servicos WHERE ID_Servico = %s AND ID_Cliente = %s AND Status = 'Aguardando Confirmação'",
            (servico_id, cliente_id)
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não está aguardando sua confirmação.")

        # Buscar os veículos alocados ao serviço para liberá-los
        cursor.execute("""
            SELECT ID_Veiculo FROM ServicoVeiculos 
            WHERE ID_Servico = %s AND Status = 'Alocado'
        """, (servico_id,))
        veiculos_alocados = [row[0] for row in cursor.fetchall()]
        
        # Atualizar o status do serviço para 'Concluido'
        cursor.execute("UPDATE Servicos SET Status = 'Concluido' WHERE ID_Servico = %s", (servico_id,))
        
        # Liberar os veículos (voltar para "Disponivel")
        if veiculos_alocados:
            placeholders = ','.join(['%s'] * len(veiculos_alocados))
            query_liberar_veiculos = f"""
                UPDATE Veiculos 
                SET Status = 'Disponivel'
                WHERE ID_Veiculo IN ({placeholders}) AND Status = 'Em Servico'
            """
            cursor.execute(query_liberar_veiculos, veiculos_alocados)
            print(f"DEBUG: {len(veiculos_alocados)} veículos liberados (voltaram para 'Disponivel') após confirmação do serviço {servico_id}")
        
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Não foi possível confirmar o serviço.")

    except pymysql.MySQLError as e:
        conn.rollback()
        print(f"DEBUG: Erro MySQL: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao confirmar o serviço: {e}")
    finally:
        conn.close()

    return {"message": "Serviço confirmado com sucesso! Agora você pode avaliá-lo."}

@router.put("/servicos/{servico_id}/cancelar", status_code=200)
def cancelar_servico(servico_id: int, cancelamento_data: CancelamentoData, current_user: dict = Depends(get_current_user)):
    """
    Cancela um serviço. Pode ser executado por cliente ou prestador.
    """
    user_id = current_user['id']
    user_type = current_user.get('tipo')
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verificar se o serviço existe e pode ser cancelado
        cursor.execute("""
            SELECT ID_Servico, ID_Cliente, ID_Prestador_Aceito, Status 
            FROM Servicos 
            WHERE ID_Servico = %s
        """, (servico_id,))
        
        servico = cursor.fetchone()
        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado.")
        
        servico_id_db, cliente_id, prestador_id, status_atual = servico
        
        # Verificar se o usuário tem permissão para cancelar
        if user_type == 'cliente' and user_id != cliente_id:
            raise HTTPException(status_code=403, detail="Você não tem permissão para cancelar este serviço.")
        elif user_type == 'prestador' and user_id != prestador_id:
            raise HTTPException(status_code=403, detail="Você não tem permissão para cancelar este serviço.")
        
        # Verificar se o serviço pode ser cancelado (não pode estar finalizado ou já cancelado)
        if status_atual in ['Concluido', 'Cancelado']:
            raise HTTPException(status_code=400, detail="Este serviço não pode ser cancelado.")
        
        # Buscar e liberar veículos alocados
        cursor.execute("""
            SELECT ID_Veiculo FROM ServicoVeiculos 
            WHERE ID_Servico = %s AND Status = 'Alocado'
        """, (servico_id,))
        veiculos_alocados = [row[0] for row in cursor.fetchall()]
        
        # Liberar veículos
        if veiculos_alocados:
            cursor.execute("""
                UPDATE Veiculos 
                SET Status = 'Disponivel' 
                WHERE ID_Veiculo IN ({})
            """.format(','.join(['%s'] * len(veiculos_alocados))), veiculos_alocados)
            
            cursor.execute("""
                UPDATE ServicoVeiculos 
                SET Status = 'Liberado' 
                WHERE ID_Servico = %s AND Status = 'Alocado'
            """, (servico_id,))
        
        # Atualizar o status do serviço para 'Cancelado'
        cursor.execute("""
            UPDATE Servicos 
            SET Status = 'Cancelado', 
                Data_Cancelamento = NOW(),
                Cancelado_Por = %s,
                Motivo_Cancelamento = %s
            WHERE ID_Servico = %s
        """, (cancelamento_data.cancelado_por, cancelamento_data.motivo_cancelamento, servico_id))
        
        conn.commit()
        
        return {
            "message": f"Serviço cancelado com sucesso por {cancelamento_data.cancelado_por}.",
            "veiculos_liberados": len(veiculos_alocados)
        }
        
    except pymysql.MySQLError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao cancelar o serviço: {e}")
    finally:
        conn.close()

@router.get("/prestador/veiculos", response_model=List[Dict[str, Any]])
def get_prestador_veiculos(current_user: dict = Depends(get_current_user)):
    """
    Busca todos os veículos do prestador logado.
    """
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas para prestadores.")

    prestador_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        query = """
            SELECT ID_Veiculo as id, Placa as placa, Tipo as tipo, 
                   AnoFabricacao as ano_fabricacao, CapacidadeToneladas as capacidade_toneladas, 
                   Status as status
            FROM Veiculos 
            WHERE ID_Prestador = %s AND Status = 'Disponivel'
            ORDER BY Tipo, Placa
        """
        cursor.execute(query, (prestador_id,))
        veiculos = cursor.fetchall()
        
        return veiculos
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Erro de banco de dados: {e}")
    finally:
        conn.close()

@router.post("/prestador/veiculos", status_code=201)
def create_veiculo(veiculo_data: VeiculoCreate, current_user: dict = Depends(get_current_user)):
    """
    Cria um novo veículo para o prestador logado.
    """
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Apenas prestadores podem cadastrar veículos.")

    prestador_id = current_user['id']
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = """
            INSERT INTO Veiculos (ID_Prestador, Placa, Tipo, AnoFabricacao, CapacidadeToneladas, Status)
            VALUES (%s, %s, %s, %s, %s, 'Disponivel')
        """
        cursor.execute(query, (
            prestador_id,
            veiculo_data.placa,
            veiculo_data.tipo,
            veiculo_data.ano_fabricacao,
            veiculo_data.capacidade_toneladas
        ))
        new_veiculo_id = cursor.lastrowid
        conn.commit()
    except pymysql.MySQLError as e:
        conn.rollback()
        if e.args[0] == 1062:  # Duplicate entry error
            raise HTTPException(status_code=400, detail="Esta placa já está cadastrada.")
        print(f"Erro no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao cadastrar o veículo.")
    finally:
        conn.close()

    return {"message": "Veículo cadastrado com sucesso!", "id_veiculo": new_veiculo_id}

# Nova rota para listar serviços publicados/disponíveis para prestadores
@router.get("/servicos/publicados", response_model=List[Dict[str, Any]])
def get_servicos_publicados(current_user: dict = Depends(get_current_user)):
    """
    Lista todos os serviços abertos (disponíveis) para prestadores visualizarem e enviarem propostas.
    """
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem visualizar serviços publicados.")

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as nome,
                s.Descricao as descricao,
                u.Nome as cliente_nome,
                s.DataServico as data_servico,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.ValorInicialCliente as valor,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.QuantidadeVeiculos as quantidade_veiculos,
                s.DataSolicitacao as data_solicitacao
            FROM Servicos s
            JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario
            WHERE s.Status = 'Aberto'
            ORDER BY s.DataSolicitacao DESC
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        servicos = []
        for row in rows:
            servico_item = {
                "id": row['id'],
                "nome": row['nome'],
                "descricao": row['descricao'],
                "cliente_nome": row['cliente_nome'],
                "data_servico": str(row['data_servico']),
                "origem": row['origem'],
                "destino": row['destino'],
                "valor": float(row['valor']),
                "tipo_veiculo": row['tipo_veiculo'],
                "quantidade_veiculos": row['quantidade_veiculos'],
                "data_solicitacao": str(row['data_solicitacao'])
            }
            servicos.append(servico_item)
        
        return servicos
        
    except Exception as e:
        print(f"Erro ao buscar serviços publicados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Endpoint para o cliente confirmar a finalização de um serviço
@router.put("/servicos/{servico_id}/confirmar-finalizacao")
def confirmar_finalizacao_cliente(servico_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get('tipo') != 'cliente':
        raise HTTPException(status_code=403, detail="Acesso negado.")

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se o serviço pertence ao cliente e está aguardando confirmação
        cursor.execute("SELECT Status FROM Servicos WHERE ID_Servico = %s AND ID_Cliente = %s", (servico_id, current_user['id']))
        servico = cursor.fetchone()

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não pertence a este cliente.")

        if servico[0] != 'Aguardando Confirmação':
            raise HTTPException(status_code=400, detail=f"Serviço não pode ser confirmado pois seu status é '{servico[0]}'")

        # Atualiza o status do serviço para "Concluido"
        cursor.execute("UPDATE Servicos SET Status = 'Concluido' WHERE ID_Servico = %s", (servico_id,))
        conn.commit()

        return {"message": "Serviço finalizado com sucesso!"}

    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao confirmar finalização do serviço.")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/servicos/disponiveis")
def get_servicos_disponiveis(current_user: dict = Depends(get_current_user)):
    """
    Lista todos os serviços com status 'Aberto' para os prestadores.
    """
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem visualizar serviços disponíveis.")

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as nome,
                s.Descricao as descricao,
                u.Nome as cliente_nome,
                s.DataServico as data_servico,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.ValorInicialCliente as valor,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.QuantidadeVeiculos as quantidade_veiculos,
                s.DataSolicitacao as data_solicitacao
            FROM Servicos s
            JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario
            WHERE s.Status = 'Aberto'
            ORDER BY s.DataSolicitacao DESC
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        servicos = []
        for row in rows:
            servico_item = {
                "id": row['id'],
                "nome": row['nome'],
                "descricao": row['descricao'],
                "cliente_nome": row['cliente_nome'],
                "data_servico": str(row['data_servico']),
                "origem": row['origem'],
                "destino": row['destino'],
                "valor": float(row['valor']),
                "tipo_veiculo": row['tipo_veiculo'],
                "quantidade_veiculos": row['quantidade_veiculos'],
                "data_solicitacao": str(row['data_solicitacao'])
            }
            servicos.append(servico_item)
        
        return servicos
        
    except Exception as e:
        print(f"Erro ao buscar serviços disponíveis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
