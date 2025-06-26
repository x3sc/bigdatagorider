"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    Card, 
    CardBody, 
    CardHeader, 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell,
    Chip,
    Spinner,
    Tabs,
    Tab
} from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import { TIPOS_VEICULO } from '@/constants/vehicleTypes';
import styles from './dashboard.module.css';

const DashboardPrestador = () => {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Espera');
    const [desistindoProposta, setDesistindoProposta] = useState(null);
    const [cancelandoServico, setCancelandoServico] = useState(null);
    const router = useRouter();

    // Função para normalizar os dados da API
    const normalizeServiceData = (servicos) => {
        return servicos.map(servico => ({
            ...servico,
            // Garante que o campo Status sempre existe
            Status: servico.Status || servico.status || servico.status_servico || 'Indefinido',
            // Normaliza outros campos que podem ter nomes diferentes
            tipo_veiculo: servico.tipo_veiculo || servico.veiculo_tipo || servico.TipoVeiculoRequerido || '',
            valor: servico.valor || servico.valor_proposto || servico.valor_acordado || 'N/A'
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'prestador') {
            router.push('/Login');
            return;
        }

        const fetchServicos = async () => {
            setLoading(true);
            setError(null);
            try {
                const currentToken = localStorage.getItem('token');
                let endpoint = '';
                
                if (activeTab === 'Espera') {
                    endpoint = 'http://127.0.0.1:5000/api/prestador/propostas/pendentes';
                } else if (activeTab === 'Em Andamento') {
                    endpoint = 'http://127.0.0.1:5000/api/prestador/servicos/aceitos';
                } else if (activeTab === 'Finalizado') {
                    endpoint = 'http://127.0.0.1:5000/api/prestador/servicos/finalizados';
                } else if (activeTab === 'Cancelado') {
                    endpoint = 'http://127.0.0.1:5000/api/prestador/servicos/cancelados';
                }

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Dados recebidos da API:', data);
                    
                    // Normaliza os dados antes de usar
                    const normalizedData = normalizeServiceData(data || []);
                    console.log('Dados normalizados:', normalizedData);
                    setServicos(normalizedData);
                } else {
                    const errorData = await response.text();
                    console.error('Erro na resposta da API:', errorData);
                    throw new Error(`Erro ${response.status}: ${errorData}`);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                setError(error.message);
                setServicos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServicos();
    }, [activeTab, router]);

    const handleDesistirProposta = async (servicoId) => {
        try {
            setDesistindoProposta(servicoId);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:5000/api/propostas/${servicoId}/desistir`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Proposta cancelada com sucesso!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao cancelar proposta');
            }
        } catch (error) {
            console.error('Erro ao cancelar proposta:', error);
            alert('Erro ao cancelar proposta. Tente novamente.');
        } finally {
            setDesistindoProposta(null);
        }
    };

    const handleFinalizarServico = async (servicoId) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            router.push('/Login');
            return;
        }

        try {
            console.log(`Finalizando serviço ${servicoId}...`);
            
            const response = await fetch(`http://127.0.0.1:5000/api/prestador/servicos/${servicoId}/finalizar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log('Resposta da finalização:', response.status, response.statusText);

            if (response.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                router.push('/Login');
                return;
            }

            if (response.status === 404) {
                alert('Serviço não encontrado ou não pertence a este prestador.');
                return;
            }

            if (response.status === 400) {
                const errorData = await response.json();
                alert(`Não é possível finalizar este serviço: ${errorData.detail}`);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
                console.error('Erro na resposta:', errorData);
                throw new Error(errorData.detail || `Erro ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Serviço finalizado com sucesso:', result);
            
            alert('Serviço marcado como finalizado. O cliente será notificado para confirmar.');
            
            // Atualiza apenas os dados sem recarregar a página toda
            const currentToken = localStorage.getItem('token');
            let endpoint = '';
            
            if (activeTab === 'Em Andamento') {
                endpoint = 'http://127.0.0.1:5000/api/prestador/servicos/aceitos';
            } else if (activeTab === 'Finalizado') {
                endpoint = 'http://127.0.0.1:5000/api/prestador/servicos/finalizados';
            }

            if (endpoint) {
                try {
                    const refreshResponse = await fetch(endpoint, {
                        headers: {
                            'Authorization': `Bearer ${currentToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        const normalizedData = normalizeServiceData(refreshData || []);
                        setServicos(normalizedData);
                    }
                } catch (refreshError) {
                    console.error('Erro ao atualizar dados:', refreshError);
                    // Em caso de erro ao atualizar, recarrega a página
                    window.location.reload();
                }
            }

        } catch (err) {
            console.error('Erro ao finalizar serviço:', err);
            setError(err.message);
            alert(`Erro ao finalizar serviço: ${err.message}`);
        }
    };

    const handleCancelarServico = async (servicoId) => {
        try {
            setCancelandoServico(servicoId);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/cancelar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cancelado_por: 'prestador',
                    motivo_cancelamento: 'Cancelado pelo prestador'
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao cancelar o serviço.');
            }

            alert('Serviço cancelado com sucesso!');
            // Recarrega os dados
            window.location.reload();
        } catch (err) {
            console.error('Erro ao cancelar serviço:', err);
            alert('Erro ao cancelar serviço. Tente novamente.');
        } finally {
            setCancelandoServico(null);
        }
    };

    const handleViewDetails = (servico) => {
        alert(`Detalhes do serviço:\n\nNome: ${servico.nome}\nCliente: ${servico.cliente_nome}\nValor: ${servico.valor}\nData: ${new Date(servico.data_servico).toLocaleDateString('pt-BR')}`);
    };

    const handleNavigateToServices = () => {
        router.push('/Prestador/ServicosDisponiveis');
    };

    const renderServicos = () => {
        if (loading) return (
            <div className={styles.loadingContainer}>
                <Spinner size="lg" color="danger" />
                <p className={styles.loadingText}>Carregando serviços...</p>
            </div>
        );
        
        if (error) return (
            <Card className={styles.errorCard}>
                <CardBody>
                    <p className={styles.errorText}>❌ Erro: {error}</p>
                </CardBody>
            </Card>
        );
        
        if (servicos.length === 0) {
            return (
                <Card className={styles.emptyStateCard}>
                    <CardBody className={styles.emptyStateBody}>
                        <div className={styles.emptyStateIcon}>📋</div>
                        <h3>Nenhum serviço encontrado</h3>
                        <p>Não há serviços nesta categoria no momento.</p>
                        {activeTab === 'Espera' && (
                            <Button 
                                color="danger" 
                                size="lg"
                                onPress={handleNavigateToServices}
                                className={styles.ctaButton}
                            >
                                Procurar Novos Transportes
                            </Button>
                        )}
                    </CardBody>
                </Card>
            );
        }

        return (
            <Table 
                aria-label="Tabela de serviços"
                className={styles.servicesTable}
                selectionMode="none"
            >
                <TableHeader>
                    <TableColumn>SERVIÇO</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>DATA</TableColumn>
                    <TableColumn>VALOR</TableColumn>
                    <TableColumn>TIPO DE VEÍCULO</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>AÇÃO</TableColumn>
                </TableHeader>
                <TableBody>
                    {servicos.map(servico => (
                        <TableRow key={servico.id}>
                            <TableCell>
                                <div className={styles.serviceInfo}>
                                    <strong>{servico.nome}</strong>
                                    <small className={styles.serviceDescription}>
                                        {servico.descricao}
                                    </small>
                                </div>
                            </TableCell>
                            <TableCell>
                                {servico.cliente_nome || (
                                    <span className={styles.noPrestador}>
                                        Cliente não informado
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(servico.data_servico).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                {servico.valor || `R$ ${servico.valor_proposto}`}
                            </TableCell>
                            <TableCell>
                                {servico.tipo_veiculo || servico.veiculo_tipo}
                            </TableCell>
                            <TableCell>
                                <Chip color={getStatusColor(servico.Status || 'indefinido')} variant="flat">
                                    {servico.Status || 'Status indefinido'}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {renderAcoes(servico)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderAcoes = (servico) => {
        const status = servico.Status?.toLowerCase() || 'indefinido';
        console.log(`Renderizando ações para serviço ${servico.id} com status: "${status}"`);
        console.log('Objeto do serviço completo:', servico);
        
        switch (status) {
            case 'em andamento':
                return (
                    <Button 
                        color="success" 
                        onClick={() => handleFinalizarServico(servico.id)}
                    >
                        Finalizar Serviço
                    </Button>
                );
            case 'pendente':
                return (
                    <Button 
                        color="danger" 
                        onClick={() => handleDesistirProposta(servico.id_proposta || servico.id)}
                        disabled={desistindoProposta === (servico.id_proposta || servico.id)}
                    >
                        {desistindoProposta === (servico.id_proposta || servico.id) ? <Spinner size="sm" /> : 'Desistir da Proposta'}
                    </Button>
                );
            case 'aguardando':
                return (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Aguardando confirmação do cliente
                    </span>
                );
            case 'finalizando':
                return (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Aguardando confirmação do cliente
                    </span>
                );
            case 'aguardando confirmação':
                return (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Aguardando confirmação do cliente
                    </span>
                );
            case 'indefinido':
                return (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        Status indefinido
                    </span>
                );
            default:
                console.log(`Nenhuma ação disponível para status: "${status}"`);
                return (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        {status}
                    </span>
                );
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendente': return 'warning';
            case 'em andamento': return 'primary';
            case 'aguardando': return 'secondary';
            case 'finalizando': return 'secondary';
            case 'aguardando confirmação': return 'secondary';
            case 'finalizado': return 'success';
            case 'cancelado': return 'danger';
            case 'indefinido': return 'default';
            default: return 'default';
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <SecondaryNavigation 
                currentPage="Dashboard"
                userType="prestador"
                userName="Prestador Demo"
            />
            
            <main className={styles.main}>
                {/* Área de Conteúdo Principal */}
                <Card className={styles.contentCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>🚛 Meus Transportes</h2>
                    </CardHeader>
                    <CardBody>
                        {/* Tabs de Status */}
                        <Tabs 
                            selectedKey={activeTab}
                            onSelectionChange={setActiveTab}
                            color="danger"
                            variant="underlined"
                            classNames={{
                                tabList: styles.tabList,
                                cursor: styles.tabCursor,
                                tab: styles.tab,
                                tabContent: styles.tabContent
                            }}
                        >
                            <Tab key="Espera" title="⏳ Propostas Pendentes">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                            <Tab key="Em Andamento" title="⚡ Em Andamento">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                            <Tab key="Finalizado" title="✅ Finalizados">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                            <Tab key="Cancelado" title="❌ Cancelados">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};

export default DashboardPrestador;
