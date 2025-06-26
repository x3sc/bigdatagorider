# Server/prestador.py

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
import pymysql
from .utils import get_db_connection
from .dependencies import get_current_user

router = APIRouter()

# Endpoint de teste para verificar se a API está funcionando
@router.get("/prestador/test")
def test_prestador_api():
    """
    Endpoint de teste simples para verificar se a API do prestador está funcionando
    """
    return {
        "message": "API do prestador funcionando!",
        "status": "success",
        "timestamp": "2024-01-15T10:00:00"
    }

# Endpoint para buscar propostas pendentes do prestador
@router.get("/prestador/propostas/pendentes")
def get_propostas_pendentes(current_user: dict = Depends(get_current_user)):
    """
    Busca todas as propostas feitas pelo prestador que ainda estão aguardando aprovação
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem ver suas propostas.")
        
        prestador_id = current_user['id']
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
          # Busca propostas pendentes com informações do serviço e cliente
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as descricao,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.DataServico as data_inicio,
                uc.Nome as cliente_nome,
                p.ValorProposto as valor_proposto,
                s.TipoVeiculoRequerido as veiculo_tipo,
                p.Status as Status
            FROM PropostasServico p
            JOIN Servicos s ON p.ID_Servico = s.ID_Servico
            JOIN Usuarios uc ON s.ID_Cliente = uc.ID_Usuario
            WHERE p.ID_Prestador = %s AND p.Status = 'Pendente'
            ORDER BY s.DataServico DESC
        """
        
        cursor.execute(query, (prestador_id,))
        propostas = cursor.fetchall()
        
        return propostas
        
    except Exception as e:
        print(f"Erro ao buscar propostas pendentes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/prestador/servicos/aceitos")
def get_servicos_aceitos(current_user: dict = Depends(get_current_user)):
    """
    Busca todos os serviços que tiveram propostas aceitas pelo prestador
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem ver seus serviços.")
        
        prestador_id = current_user['id']
        print(f"DEBUG: Buscando serviços aceitos para prestador ID: {prestador_id}")
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Busca serviços aceitos com informações do cliente
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as descricao,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.DataServico as data_inicio,
                uc.Nome as cliente_nome,
                p.ValorProposto as valor_acordado,
                s.Status as Status
            FROM PropostasServico p
            JOIN Servicos s ON p.ID_Servico = s.ID_Servico
            JOIN Usuarios uc ON s.ID_Cliente = uc.ID_Usuario
            WHERE p.ID_Prestador = %s AND p.Status = 'Aceita' AND s.Status = 'Em Andamento'
            ORDER BY s.DataServico DESC
        """
        
        cursor.execute(query, (prestador_id,))
        servicos = cursor.fetchall()
        
        print(f"DEBUG: Serviços encontrados: {servicos}")
        
        return servicos
        
    except Exception as e:
        print(f"Erro ao buscar serviços aceitos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Novo endpoint para buscar o perfil do prestador
@router.get("/perfil-prestador/{prestador_id}")
def get_perfil_prestador(prestador_id: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Query para buscar os dados do prestador
        query = """
            SELECT
                u.ID_Usuario as id,
                u.Nome as nome,
                u.Email as email,
                u.Telefone as telefone,
                u.Foto_URL as fotoUrl,
                p.CNH as cnh,
                p.Disponibilidade as disponibilidade,
                p.AvaliacaoMedia as avaliacaoMedia
            FROM Usuarios u
            JOIN Prestadores p ON u.ID_Usuario = p.ID_Usuario
            WHERE u.ID_Usuario = %s AND u.TipoUsuario = 'prestador'
        """
        cursor.execute(query, (prestador_id,))
        prestador = cursor.fetchone()

        if not prestador:
            raise HTTPException(status_code=404, detail="Prestador não encontrado")

        # Query para buscar as avaliações do prestador
        query_avaliacoes = """
            SELECT
                a.Estrelas as estrelas,
                a.Comentario as comentario,
                u.Nome as nome_cliente
            FROM Avaliacoes a
            JOIN Usuarios u ON a.ID_Cliente = u.ID_Usuario
            WHERE a.ID_Prestador = %s
            ORDER BY a.DataAvaliacao DESC
        """
        cursor.execute(query_avaliacoes, (prestador_id,))
        avaliacoes = cursor.fetchall()

        prestador['avaliacoes'] = avaliacoes

        return prestador

    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar perfil do prestador")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Endpoint para o prestador marcar um serviço como finalizado (aguardando confirmação)
@router.put("/prestador/servicos/{servico_id}/finalizar")
def finalizar_servico_prestador(servico_id: int, current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: Iniciando finalização do serviço {servico_id} pelo prestador {current_user.get('id')}")
    
    if current_user.get('tipo') != 'prestador':
        raise HTTPException(status_code=403, detail="Acesso negado.")

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        print(f"DEBUG: Verificando se serviço {servico_id} pertence ao prestador {current_user['id']}")

        # Verifica se o serviço pertence ao prestador e está em andamento
        cursor.execute("SELECT Status, ID_Cliente, Nome FROM Servicos WHERE ID_Servico = %s AND ID_Prestador_Aceito = %s", (servico_id, current_user['id']))
        servico = cursor.fetchone()
        
        print(f"DEBUG: Resultado da consulta: {servico}")

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado ou não pertence a este prestador.")

        status_atual, cliente_id, nome_servico = servico
        print(f"DEBUG: Status atual: {status_atual}, Cliente ID: {cliente_id}, Nome: {nome_servico}")

        if status_atual != 'Em Andamento':
            raise HTTPException(status_code=400, detail=f"Serviço não pode ser finalizado pois seu status é '{status_atual}'")

        print(f"DEBUG: Atualizando status do serviço {servico_id} para 'Aguardando Confirmação'")
        
        # Atualiza o status do serviço para "Aguardando Confirmação" (aguardando confirmação do cliente)
        cursor.execute("UPDATE Servicos SET Status = 'Aguardando Confirmação' WHERE ID_Servico = %s", (servico_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=500, detail="Nenhuma linha foi atualizada")
            
        conn.commit()
        print(f"DEBUG: Serviço {servico_id} finalizado com sucesso")

        # Notificar o cliente sobre a finalização
        try:
            notificar_cliente_finalizacao(cliente_id, servico_id, nome_servico)
        except Exception as notif_error:
            print(f"AVISO: Erro ao notificar cliente: {notif_error}")
            # Não falha a operação se a notificação der erro

        # Notificar cliente sobre a finalização do serviço
        nome_servico = "Serviço #" + str(servico_id)  # Obter o nome do serviço de alguma forma, se necessário
        notificar_cliente_finalizacao(cliente_id, servico_id, nome_servico)

        return {"message": "Serviço marcado como finalizado. Aguardando confirmação do cliente."}

    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados: {e}")
        print(f"DEBUG: Detalhes do erro MySQL: {str(e)}")
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao finalizar serviço: {str(e)}")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        print(f"DEBUG: Tipo do erro: {type(e)}")
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro inesperado: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/prestador/servicos/finalizados")
def get_servicos_finalizados(current_user: dict = Depends(get_current_user)):
    """
    Busca todos os serviços que foram finalizados pelo prestador
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem ver seus serviços.")
        
        prestador_id = current_user['id']
        print(f"DEBUG: Buscando serviços finalizados para prestador ID: {prestador_id}")
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Busca serviços finalizados com informações do cliente
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as descricao,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.DataServico as data_inicio,
                s.DataConclusao as data_fim,
                uc.Nome as cliente_nome,
                p.ValorProposto as valor_acordado,
                s.Status
            FROM Servicos s
            JOIN PropostasServico p ON s.ID_Servico = p.ID_Servico AND p.Status = 'Aceita'
            JOIN Usuarios uc ON s.ID_Cliente = uc.ID_Usuario
            WHERE s.ID_Prestador_Aceito = %s AND (s.Status = 'Concluido' OR s.Status = 'Aguardando Confirmação')
            ORDER BY s.DataServico DESC
        """
        
        print(f"DEBUG: Executando query: {query}")
        print(f"DEBUG: Com prestador_id: {prestador_id}")
        
        cursor.execute(query, (prestador_id,))
        servicos = cursor.fetchall()
        
        print(f"DEBUG: Encontrados {len(servicos)} serviços finalizados")
        
        return servicos
        
    except Exception as e:
        print(f"Erro ao buscar serviços finalizados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Endpoint para finalizar um serviço
@router.put("/servicos/{servico_id}/finalizar")
def finalizar_servico(servico_id: int, current_user: dict = Depends(get_current_user)):
    """
    Permite ao prestador finalizar um serviço em andamento
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem finalizar serviços.")
        
        prestador_id = current_user['id']
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Verifica se o serviço pertence ao prestador e está em andamento
        query_verificar = """
            SELECT ID_Servico, Status 
            FROM Servicos 
            WHERE ID_Servico = %s AND ID_Prestador_Aceito = %s AND Status = 'Em Andamento'
        """
        
        cursor.execute(query_verificar, (servico_id, prestador_id))
        servico = cursor.fetchone()
        
        if not servico:
            raise HTTPException(
                status_code=404, 
                detail="Serviço não encontrado ou você não tem permissão para finalizá-lo."
            )
          # Atualiza o status do serviço para Concluido
        query_finalizar = """
            UPDATE Servicos 
            SET Status = 'Concluido'
            WHERE ID_Servico = %s
        """
        
        cursor.execute(query_finalizar, (servico_id,))
        
        # Atualiza o status na tabela ServicoVeiculos se existir
        query_finalizar_veiculos = """
            UPDATE ServicoVeiculos 
            SET Status = 'Concluido', DataConclusao = NOW()
            WHERE ID_Servico = %s AND Status != 'Concluido'
        """
        
        cursor.execute(query_finalizar_veiculos, (servico_id,))
        
        # IMPORTANTE: Libera os veículos de volta para "Disponivel"
        query_liberar_veiculos = """
            UPDATE Veiculos 
            SET Status = 'Disponivel'
            WHERE ID_Veiculo IN (
                SELECT sv.ID_Veiculo 
                FROM ServicoVeiculos sv 
                WHERE sv.ID_Servico = %s
            ) AND Status = 'Em Servico'
        """
        
        cursor.execute(query_liberar_veiculos, (servico_id,))
        
        print(f"DEBUG: Serviço {servico_id} finalizado. Veículos liberados para disponível.")
        
        conn.commit()
        
        return {"message": "Serviço finalizado com sucesso!", "servico_id": servico_id}
        
    except Exception as e:
        print(f"Erro ao finalizar serviço: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Endpoint para buscar estatísticas do prestador
@router.get("/prestador/estatisticas")
def get_estatisticas_prestador(current_user: dict = Depends(get_current_user)):
    """
    Busca estatísticas gerais do prestador (propostas, serviços, etc.)
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado.")
        
        prestador_id = current_user['id']
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Conta propostas pendentes
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM PropostasServico 
            WHERE ID_Prestador = %s AND Status = 'Pendente'
        """, (prestador_id,))
        propostas_pendentes = cursor.fetchone()['total']
        
        # Conta serviços em andamento
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM Servicos 
            WHERE ID_Prestador_Aceito = %s AND Status = 'Em Andamento'
        """, (prestador_id,))
        servicos_andamento = cursor.fetchone()['total']
        
        # Conta serviços finalizados
        cursor.execute("""
            SELECT COUNT(*) as total 
            FROM Servicos 
            WHERE ID_Prestador_Aceito = %s AND Status = 'Concluido'
        """, (prestador_id,))
        servicos_finalizados = cursor.fetchone()['total']
        
        # Calcula ganhos totais
        cursor.execute("""
            SELECT COALESCE(SUM(p.ValorProposto), 0) as total 
            FROM Servicos s
            JOIN PropostasServico p ON s.ID_Servico = p.ID_Servico
            WHERE s.ID_Prestador_Aceito = %s AND s.Status = 'Concluido'
        """, (prestador_id,))
        ganhos_totais = cursor.fetchone()['total']
        
        return {
            "propostas_pendentes": propostas_pendentes,
            "servicos_andamento": servicos_andamento,
            "servicos_finalizados": servicos_finalizados,
            "ganhos_totais": float(ganhos_totais) if ganhos_totais else 0.0
        }
        
    except Exception as e:
        print(f"Erro ao buscar estatísticas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Endpoint para desistir de uma proposta
@router.delete("/propostas/{proposta_id}/desistir")
def desistir_proposta(proposta_id: int, current_user: dict = Depends(get_current_user)):
    """
    Permite ao prestador desistir de uma proposta pendente
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado. Apenas prestadores podem desistir de propostas.")
        
        prestador_id = current_user['id']
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Verifica se a proposta existe e pertence ao prestador
        query_verificar = """
            SELECT p.ID_Proposta, p.Status, p.ID_Servico, s.Status as servico_status
            FROM PropostasServico p
            JOIN Servicos s ON p.ID_Servico = s.ID_Servico
            WHERE p.ID_Proposta = %s AND p.ID_Prestador = %s
        """
        
        cursor.execute(query_verificar, (proposta_id, prestador_id))
        proposta = cursor.fetchone()
        
        if not proposta:
            raise HTTPException(
                status_code=404, 
                detail="Proposta não encontrada ou você não tem permissão para cancelá-la."
            )
        
        # Verifica se a proposta ainda está pendente
        if proposta['Status'] != 'Pendente':
            raise HTTPException(
                status_code=400, 
                detail=f"Não é possível desistir de uma proposta com status '{proposta['Status']}'."
            )
        
        # Se o serviço já foi aceito por outro prestador, não permite cancelamento
        if proposta['servico_status'] != 'Aberto':
            raise HTTPException(
                status_code=400, 
                detail="Este serviço já foi aceito por outro prestador."
            )
        
        # Remove a proposta
        query_deletar = """
            DELETE FROM PropostasServico 
            WHERE ID_Proposta = %s
        """
        
        cursor.execute(query_deletar, (proposta_id,))
        
        # Remove também os veículos associados à proposta
        query_deletar_veiculos = """
            DELETE FROM PropostaVeiculos 
            WHERE ID_Proposta = %s
        """
        
        cursor.execute(query_deletar_veiculos, (proposta_id,))
        
        print(f"DEBUG: Proposta {proposta_id} do prestador {prestador_id} foi cancelada")
        
        conn.commit()
        
        return {"message": "Proposta cancelada com sucesso!"}
        
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Erro ao cancelar proposta: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/prestador/servicos/cancelados")
def get_servicos_cancelados(current_user: dict = Depends(get_current_user)):
    """
    Busca todos os serviços que foram cancelados pelo prestador
    """
    conn = None
    cursor = None
    try:
        if current_user.get('tipo') != 'prestador':
            raise HTTPException(status_code=403, detail="Acesso negado.")
        
        prestador_id = current_user['id']
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Busca serviços cancelados com informações do cliente
        query = """
            SELECT 
                s.ID_Servico as id,
                s.Nome as descricao,
                s.EnderecoOrigem as origem,
                s.EnderecoDestino as destino,
                s.TipoVeiculoRequerido as tipo_veiculo,
                s.DataServico as data_inicio,
                uc.Nome as cliente_nome,
                p.ValorProposto as valor_acordado,
                s.Status as Status,
                s.CanceladoPor as cancelado_por,
                s.MotivoCancelamento as motivo_cancelamento
            FROM PropostasServico p
            JOIN Servicos s ON p.ID_Servico = s.ID_Servico
            JOIN Usuarios uc ON s.ID_Cliente = uc.ID_Usuario
            WHERE p.ID_Prestador = %s AND s.Status = 'Cancelado'
            ORDER BY s.DataServico DESC
        """
        
        cursor.execute(query, (prestador_id,))
        servicos_cancelados = cursor.fetchall()
        
        return servicos_cancelados
        
    except Exception as e:
        print(f"Erro ao buscar serviços cancelados: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função auxiliar para notificar cliente sobre finalização de serviço
def notificar_cliente_finalizacao(cliente_id: int, servico_id: int, nome_servico: str):
    """
    Função placeholder para notificar o cliente sobre a finalização do serviço.
    Em uma implementação real, isso poderia enviar email, push notification, etc.
    """
    print(f"NOTIFICAÇÃO: Cliente {cliente_id} - Serviço '{nome_servico}' (ID: {servico_id}) foi finalizado pelo prestador e aguarda sua confirmação.")
    
    # Aqui você poderia implementar:
    # - Envio de email
    # - Push notification
    # - SMS
    # - Webhook para sistema externo
    # - Inserção em tabela de notificações
    
    return True
