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
    const router = useRouter();

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
                    endpoint = 'http://localhost:5000/api/prestador/propostas/pendentes';
                } else if (activeTab === 'Em Andamento') {
                    endpoint = 'http://localhost:5000/api/prestador/servicos/aceitos';
                } else if (activeTab === 'Finalizado') {
                    endpoint = 'http://localhost:5000/api/prestador/servicos/finalizados';
                }

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setServicos(data || []);
                } else {
                    console.log('Resposta não OK, usando dados simulados');
                    setServicos(getSimulatedData());
                }
            } catch (error) {
                console.log('Erro na requisição, usando dados simulados:', error);
                setServicos(getSimulatedData());
            } finally {
                setLoading(false);
            }
        };

        // Login simulado para demonstração
        const simulateLogin = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'prestador@demo.com',
                        password: 'demo123',
                        user_type: 'prestador'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('userType', 'prestador');
                    fetchServicos();
                } else {
                    localStorage.setItem('token', 'demo-token-prestador');
                    localStorage.setItem('userType', 'prestador');
                    fetchServicos();
                }
            } catch (error) {
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

    const getSimulatedData = () => {
        const baseServicos = [
            {
                id: 1,
                nome: 'Transporte para Aeroporto',
                descricao: 'Viagem até Aeroporto Internacional',
                cliente_nome: 'João Silva',
                origem: 'Centro da Cidade',
                destino: 'Aeroporto Internacional',
                data_servico: '2024-12-27',
                valor: 'R$ 45,00',
                tipo_veiculo: 'Carro',
                Status: 'Pendente'
            },
            {
                id: 2,
                nome: 'Mudança Residencial',
                descricao: 'Transporte de móveis e utensílios',
                cliente_nome: 'Maria Santos',
                origem: 'Bairro A',
                destino: 'Bairro B',
                data_servico: '2024-12-28',
                valor: 'R$ 120,00',
                tipo_veiculo: 'Caminhão',
                Status: 'Em Andamento'
            },
            {
                id: 3,
                nome: 'Entrega de Documentos',
                descricao: 'Documentos urgentes',
                cliente_nome: 'Carlos Lima',
                origem: 'Escritório Central',
                destino: 'Cartório',
                data_servico: '2024-12-25',
                valor: 'R$ 25,00',
                tipo_veiculo: 'Moto',
                Status: 'Finalizado'
            }
        ];

        if (activeTab === 'Espera') {
            return baseServicos.filter(s => s.Status === 'Pendente');
        } else if (activeTab === 'Em Andamento') {
            return baseServicos.filter(s => s.Status === 'Em Andamento');
        } else if (activeTab === 'Finalizado') {
            return baseServicos.filter(s => s.Status === 'Finalizado');
        }
        return baseServicos;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendente': return 'warning';
            case 'Em Andamento': return 'primary';
            case 'Finalizado': return 'success';
            default: return 'default';
        }
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
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:5000/api/servicos/${servicoId}/finalizar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Serviço finalizado com sucesso!');
                setActiveTab('Finalizado');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao finalizar serviço');
            }
        } catch (error) {
            console.error('Erro ao finalizar serviço:', error);
            alert('Erro ao finalizar serviço. Tente novamente.');
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
                                    <span className={styles.noCliente}>
                                        Cliente não informado
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(servico.data_servico).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    color={getStatusColor(servico.Status)}
                                    variant="flat"
                                    size="sm"
                                >
                                    {servico.Status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {activeTab === 'Espera' && (
                                    <Button 
                                        size="sm"
                                        color="danger"
                                        variant="bordered"
                                        onPress={() => handleDesistirProposta(servico.id)}
                                        isLoading={desistindoProposta === servico.id}
                                        isDisabled={desistindoProposta !== null}
                                    >
                                        ❌ Desistir
                                    </Button>
                                )}
                                {activeTab === 'Em Andamento' && (
                                    <Button 
                                        size="sm"
                                        color="success"
                                        onPress={() => handleFinalizarServico(servico.id)}
                                    >
                                        ✅ Finalizar
                                    </Button>
                                )}
                                {activeTab === 'Finalizado' && (
                                    <Button 
                                        size="sm"
                                        color="primary"
                                        variant="bordered"
                                        onPress={() => handleViewDetails(servico)}
                                    >
                                        👁️ Ver Detalhes
                                    </Button>
                                )}
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
                        </Tabs>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};

export default DashboardPrestador;
