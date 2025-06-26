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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
    Tabs,
    Tab
} from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import styles from './dashboardCliente.module.css';

const DashboardCliente = () => {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Abertos');
    const [showPropostasModal, setShowPropostasModal] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [propostas, setPropostas] = useState([]);
    const [loadingPropostas, setLoadingPropostas] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'cliente') {
            router.push('/Login');
            return;
        }

        const fetchServicos = async () => {
            setLoading(true);
            setError(null);
            try {
                // Mapeia a aba para o status esperado pelo backend
                const status = activeTab === 'Em Andamento' ? 'andamento' : activeTab.toLowerCase();

                const response = await fetch(`http://127.0.0.1:5000/api/cliente/servicos/${status}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao buscar os serviços.');
                }

                const data = await response.json();
                setServicos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicos();
    }, [router, activeTab]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'aberto':
                return 'primary';
            case 'em andamento':
            case 'andamento':
                return 'warning';
            case 'concluido':
            case 'finalizado':
                return 'success';
            case 'aguardando confirmação':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const handleNavigateToCreateService = () => {
        router.push('/Cliente/CriarServico');
    };

    const handleNavigateToAvaliacao = (servicoId) => {
        router.push(`/Cliente/Avaliar/${servicoId}`);
    };

    const handleConfirmFinalization = async (servicoId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/confirmar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao confirmar finalização.');
            }

            // Recarrega os serviços
            setActiveTab('Finalizados');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewPropostas = async (servico) => {
        setServicoSelecionado(servico);
        setLoadingPropostas(true);
        setShowPropostasModal(true);
        
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servico.id}/propostas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar propostas.');
            }

            const data = await response.json();
            setPropostas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingPropostas(false);
        }
    };

    const handleAcceptProposta = async (propostaId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/propostas/${propostaId}/aceitar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao aceitar a proposta.');
            }

            // Fecha o modal e atualiza para a aba "Em Andamento"
            setShowPropostasModal(false);
            setActiveTab('Em Andamento');
        } catch (err) {
            setError(err.message);
        }
    };

    const closeModal = () => {
        setShowPropostasModal(false);
        setServicoSelecionado(null);
        setPropostas([]);
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
                        {activeTab === 'Abertos' && (
                            <Button 
                                color="danger" 
                                size="lg"
                                onPress={handleNavigateToCreateService}
                                className={styles.ctaButton}
                            >
                                Criar Novo Serviço
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
                    <TableColumn>PRESTADOR</TableColumn>
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
                                {servico.prestador_nome || (
                                    <span className={styles.noPrestador}>
                                        Aguardando Proposta
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(servico.data_servico).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    color={getStatusColor(servico.status)}
                                    variant="flat"
                                    size="sm"
                                >
                                    {servico.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {servico.status === 'Aberto' && (
                                    <Button 
                                        size="sm"
                                        color="primary"
                                        variant="bordered"
                                        onPress={() => handleViewPropostas(servico)}
                                    >
                                        Ver Propostas
                                    </Button>
                                )}
                                {servico.status === 'Aguardando Confirmação' && (
                                    <Button 
                                        size="sm"
                                        color="success"
                                        onPress={() => handleConfirmFinalization(servico.id)}
                                    >
                                        Confirmar Finalização
                                    </Button>
                                )}
                                {servico.status === 'Concluido' && (
                                    <Button 
                                        size="sm"
                                        color="warning"
                                        variant="bordered"
                                        onPress={() => handleNavigateToAvaliacao(servico.id)}
                                    >
                                        Avaliar
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };    return (
        <div className={styles.pageContainer}>
            <Header />
            <SecondaryNavigation 
                currentPage="Dashboard"
                userType="cliente"
                userName="Cliente Demo"
            />
            
            <main className={styles.main}>
                {/* Área de Conteúdo Principal */}
                <Card className={styles.contentCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>📋 Meus Serviços</h2>
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
                            <Tab key="Abertos" title="🔓 Abertos">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                            <Tab key="Em Andamento" title="⚡ Em Andamento">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                            <Tab key="Finalizados" title="✅ Finalizados">
                                <div className={styles.tabContent}>
                                    {renderServicos()}
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>

                {/* Modal de Propostas com Hero UI */}
                <Modal 
                    isOpen={showPropostasModal} 
                    onClose={closeModal}
                    size="2xl"
                    classNames={{
                        backdrop: styles.modalBackdrop,
                        base: styles.modalBase,
                        header: styles.modalHeader,
                        body: styles.modalBody,
                        footer: styles.modalFooter
                    }}
                >
                    <ModalContent>
                        <ModalHeader className={styles.modalHeaderContent}>
                            <h3>💼 Propostas para: {servicoSelecionado?.nome}</h3>
                        </ModalHeader>
                        <ModalBody>
                            {loadingPropostas ? (
                                <div className={styles.modalLoading}>
                                    <Spinner size="md" color="danger" />
                                    <p>Carregando propostas...</p>
                                </div>
                            ) : propostas.length === 0 ? (
                                <Card className={styles.emptyPropostas}>
                                    <CardBody className={styles.emptyPropostasBody}>
                                        <div className={styles.emptyIcon}>📭</div>
                                        <h4>Nenhuma proposta recebida</h4>
                                        <p>Aguarde, os prestadores podem enviar propostas a qualquer momento.</p>
                                    </CardBody>
                                </Card>
                            ) : (
                                <div className={styles.propostasList}>
                                    {propostas.map(proposta => (
                                        <Card key={proposta.id_proposta} className={styles.propostaCard}>
                                            <CardBody>
                                                <div className={styles.propostaContent}>
                                                    <div className={styles.propostaInfo}>
                                                        <h4>👤 {proposta.nome_prestador}</h4>
                                                        <div className={styles.propostaDetails}>
                                                            <Chip color="success" variant="flat" size="sm">
                                                                R$ {proposta.valor_proposto}
                                                            </Chip>
                                                        </div>
                                                        {proposta.mensagem && (
                                                            <div className={styles.mensagemProposta}>
                                                                <strong>💬 Mensagem:</strong>
                                                                <p>{proposta.mensagem}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button 
                                                        color="success"
                                                        size="md"
                                                        onPress={() => handleAcceptProposta(proposta.id_proposta)}
                                                        className={styles.acceptButton}
                                                    >
                                                        ✅ Aceitar
                                                    </Button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="danger" 
                                variant="light" 
                                onPress={closeModal}
                            >
                                Fechar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </main>
        </div>
    );
};

export default DashboardCliente;
