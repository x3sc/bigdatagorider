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
    const [activeTab, setActiveTab] = useState('Espera');
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [desistindoProposta, setDesistindoProposta] = useState(null);
    
    const router = useRouter();    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        // Função para buscar serviços do backend
        const fetchServicos = async () => {
            setLoading(true);
            setError(null);
            try {
                const currentToken = localStorage.getItem('token');
                let endpoint = '';
                
                if (activeTab === 'Espera') {
                    endpoint = 'http://localhost:5000/api/prestador/propostas/pendentes';
                } else if (activeTab === 'Em Andamento') {
                    endpoint = 'http://localhost:5000/api/prestador/servicos/aceitos';
                } else if (activeTab === 'Finalizado') {
                    endpoint = 'http://localhost:5000/api/prestador/servicos/finalizados';
                }

                console.log(`Fazendo requisição para: ${endpoint}`);
                console.log(`Token: ${currentToken ? 'Presente' : 'Ausente'}`);

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json'
                    },
                });

                console.log(`Status da resposta: ${response.status}`);
                console.log(`Headers da resposta:`, response.headers);

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Token inválido, usando dados simulados');
                        throw new Error('Token inválido - usando dados simulados');
                    }
                    if (response.status === 400) {
                        const errorText = await response.text();
                        console.log('Erro 400 - Detalhes:', errorText);
                        throw new Error(`Erro de requisição (400): ${errorText}`);
                    }
                    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                    throw new Error(errorData.message || errorData.detail || 'Falha ao buscar os serviços.');
                }

                const data = await response.json();
                console.log('Dados recebidos:', data);
                setServicos(data);
            } catch (err) {
                console.log('Usando dados simulados devido ao erro:', err.message);
                const servicosSimulados = {
                    'Espera': [
                        {
                            id: 1,
                            descricao: 'Transporte de Mudança (Demo)',
                            cliente_nome: 'João Silva',
                            origem: 'Centro - São Paulo',
                            destino: 'Vila Madalena - São Paulo',
                            valor_proposto: 150.00,
                            veiculo_tipo: 'Caminhão',
                            data_inicio: '2024-01-15',
                            tipo_veiculo: 'Caminhão',
                            Status: 'Pendente'
                        }
                    ],
                    'Em Andamento': [
                        {
                            id: 3,
                            descricao: 'Transporte Empresarial (Demo)',
                            cliente_nome: 'Empresa ABC Ltda',
                            origem: 'Av. Paulista, 1000',
                            destino: 'Porto de Santos',
                            valor_acordado: 300.00,
                            data_inicio: '2024-01-14',
                            tipo_veiculo: 'Caminhão',
                            Status: 'Em Andamento'
                        }
                    ],
                    'Finalizado': [
                        {
                            id: 4,
                            descricao: 'Mudança Residencial (Demo)',
                            cliente_nome: 'Carlos Oliveira',
                            origem: 'Mooca - São Paulo',
                            destino: 'Tatuapé - São Paulo',
                            valor_acordado: 250.00,
                            data_inicio: '2024-01-10',
                            data_fim: '2024-01-10',
                            tipo_veiculo: 'Caminhão Baú',
                            Status: 'Concluido'
                        }
                    ]
                };
                setServicos(servicosSimulados[activeTab] || []);
                setError('Conectado com dados de demonstração - Backend pode estar indisponível');
            } finally {
                setLoading(false);
            }
        };

        const simulateLogin = async () => {
            try {
                console.log('Tentando fazer login automático...');
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'testepres@teste.com',
                        password: '1324',
                        tipo: 1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Login bem-sucedido:', data.user_type);
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('userType', 'prestador');
                    fetchServicos();
                } else {
                    console.log('Login de demo falhou, usando dados simulados');
                    localStorage.setItem('token', 'demo-token-prestador');
                    localStorage.setItem('userType', 'prestador');
                    fetchServicos();
                }
            } catch (error) {
                console.log('Erro no login de demo, usando dados simulados:', error);
                localStorage.setItem('token', 'demo-token-prestador');
                localStorage.setItem('userType', 'prestador');
                fetchServicos();
            }
        };

        if (!token || userType !== 'prestador') {
            simulateLogin();
        } else {
            fetchServicos();
        }
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
                // Recarregar a lista de serviços
                window.location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao cancelar proposta');
            }

        } catch (error) {
            console.error('Erro ao cancelar proposta:', error);
            alert(`Erro ao cancelar proposta: ${error.message}`);
        } finally {
            setDesistindoProposta(null);
        }
    };

    const handleFinalizarServico = async (servicoId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/servicos/${servicoId}/finalizar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao finalizar o serviço.');
            }

            const data = await response.json();
            alert('Serviço finalizado com sucesso! Aguardando confirmação do cliente para liberar o veículo.');
            
            setActiveTab('Finalizado');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewDetails = (servico) => {
        alert(`Detalhes do Serviço:\\n\\nServiço: ${servico.descricao}\\nCliente: ${servico.cliente_nome}\\nValor: R$ ${servico.valor_acordado?.toFixed(2) || '0,00'}\\nRota: ${servico.origem} → ${servico.destino}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Espera':
            case 'Aberto':
                return 'warning';
            case 'Em Andamento':
                return 'primary';
            case 'Finalizado':
            case 'Concluido':
                return 'success';
            default:
                return 'default';
        }
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
                                onPress={() => router.push('/Prestador/ServicosDisponiveis')}
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
                    <TableColumn>ROTA</TableColumn>
                    <TableColumn>VALOR</TableColumn>
                    <TableColumn>DATA</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>AÇÕES</TableColumn>
                </TableHeader>
                <TableBody>
                    {servicos.map((servico) => (
                        <TableRow key={servico.id}>
                            <TableCell>
                                <div>
                                    <p className={styles.serviceName}>{servico.descricao}</p>
                                    <p className={styles.vehicleType}>{servico.tipo_veiculo || servico.veiculo_tipo}</p>
                                </div>
                            </TableCell>
                            <TableCell>{servico.cliente_nome}</TableCell>
                            <TableCell>
                                <div className={styles.route}>
                                    <p className={styles.routeText}>📍 {servico.origem}</p>
                                    <p className={styles.routeText}>📍 {servico.destino}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={styles.price}>
                                    R$ {(servico.valor_proposto || servico.valor_acordado || 0).toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p>{new Date(servico.data_inicio).toLocaleDateString('pt-BR')}</p>
                                    {servico.data_fim && <p>Fim: {new Date(servico.data_fim).toLocaleDateString('pt-BR')}</p>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    color={getStatusColor(servico.Status)} 
                                    variant="flat"
                                >
                                    {servico.Status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className={styles.actionButtons}>
                                    {activeTab === 'Espera' && (
                                        <Button 
                                            color="danger" 
                                            size="sm"
                                            variant="flat"
                                            onPress={() => handleDesistirProposta(servico.id)}
                                            isLoading={desistindoProposta === servico.id}
                                            isDisabled={desistindoProposta !== null}
                                        >
                                            {desistindoProposta === servico.id ? 'Cancelando...' : '❌ Desistir'}
                                        </Button>
                                    )}
                                    {activeTab === 'Em Andamento' && (
                                        <Button 
                                            color="success" 
                                            size="sm"
                                            onPress={() => handleFinalizarServico(servico.id)}
                                        >
                                            Finalizar
                                        </Button>
                                    )}
                                    {activeTab === 'Finalizado' && (
                                        <Button 
                                            color="primary" 
                                            size="sm"
                                            onPress={() => handleViewDetails(servico)}
                                        >
                                            Ver Detalhes
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <SecondaryNavigation 
                currentPage="Dashboard"
                userType="prestador"
                userName="Prestador Demo"
            />
            
            <main className={styles.mainContent}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.pageTitle}>Dashboard do Prestador</h1>
                        <p className={styles.pageSubtitle}>Gerencie seus serviços e propostas</p>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    <Card className={styles.dashboardCard}>
                        <CardHeader className={styles.cardHeader}>
                            <Tabs 
                                aria-label="Tipos de serviços"
                                selectedKey={activeTab}
                                onSelectionChange={handleTabClick}
                                className={styles.serviceTabs}
                                color="danger"
                                variant="underlined"
                            >
                                <Tab key="Espera" title="Propostas Pendentes">
                                    <div className={styles.tabContent}>
                                        <h3>Propostas Aguardando Aprovação</h3>
                                        <p>Serviços que você fez propostas e estão aguardando resposta do cliente.</p>
                                    </div>
                                </Tab>
                                <Tab key="Em Andamento" title="Serviços Aceitos">
                                    <div className={styles.tabContent}>
                                        <h3>Serviços em Andamento</h3>
                                        <p>Serviços que foram aceitos e estão sendo executados.</p>
                                    </div>
                                </Tab>
                                <Tab key="Finalizado" title="Serviços Finalizados">
                                    <div className={styles.tabContent}>
                                        <h3>Histórico de Serviços</h3>
                                        <p>Serviços que foram completados com sucesso.</p>
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardHeader>
                        <CardBody className={styles.cardBody}>
                            {renderServicos()}
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DashboardPrestador;
