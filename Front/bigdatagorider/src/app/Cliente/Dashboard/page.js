"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import Header from '@/components/header';

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

    const handleNavigateToCreateService = () => {
        router.push('/Cliente/CriarServico');
    };

    const handleNavigateToAvaliacao = (servicoId) => {
        router.push(`/Avaliacao/${servicoId}`);
    };    const handleConfirmFinalization = async (servicoId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/confirmar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao confirmar a finalização do serviço.');
            }

            // Atualiza a lista de serviços para refletir a mudança de status
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
        if (loading) return <p className={styles.message}>Carregando serviços...</p>;
        if (error) return <p className={`${styles.message} ${styles.error}`}>Erro: {error}</p>;
        if (servicos.length === 0) {
            return (
                <div className={styles.noServicesContainer}>
                    <p className={styles.message}>Nenhum serviço encontrado para esta categoria.</p>
                    {activeTab === 'Abertos' && (
                         <button onClick={handleNavigateToCreateService} className={styles.mainButton}>
                            Solicitar Novo Serviço
                         </button>
                    )}
                </div>
            );
        }

        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>SERVIÇO</th>
                        <th>PRESTADOR</th>
                        <th>DATA</th>
                        <th>STATUS</th>
                        <th>AÇÃO</th>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(servico => (
                        <tr key={servico.id}>
                            <td>{servico.nome}</td>
                            <td>{servico.prestador_nome || 'Aguardando Proposta'}</td>
                            <td>{new Date(servico.data_servico).toLocaleDateString()}</td>
                            <td>
                                <span className={`${styles.status} ${styles[servico.status.toLowerCase().replace(/ /g, '-')]}`}>
                                    {servico.status}
                                </span>
                            </td>                            <td>
                                {servico.status === 'Aberto' && (
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleViewPropostas(servico)}
                                    >
                                        Ver Propostas
                                    </button>
                                )}
                                {servico.status === 'Aguardando Confirmação' && (
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleConfirmFinalization(servico.id)}
                                    >
                                        Confirmar Finalização
                                    </button>
                                )}
                                {servico.status === 'Concluido' && (
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleNavigateToAvaliacao(servico.id)}
                                    >
                                        Avaliar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <main className={styles.main}>
                <div className={styles.mainTabs}>
                    <button
                        onClick={handleNavigateToCreateService}
                    >
                        Criar nova solicitação
                    </button>
                    <button className={styles.activeMainTab}>
                        Meus Serviços
                    </button>
                    <button onClick={() => alert('Planos de assinatura em breve!')}>
                        Planos de assinatura
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Abertos' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Abertos')}
                        >
                            Abertos
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Em Andamento' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Em Andamento')}
                        >
                            Em Andamento
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Finalizados' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Finalizados')}
                        >
                            Finalizados
                        </button>
                    </div>                    {renderServicos()}
                </div>

                {/* Modal de Propostas */}
                {showPropostasModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>Propostas para: {servicoSelecionado?.nome}</h3>
                                <button className={styles.closeButton} onClick={closeModal}>×</button>
                            </div>
                            <div className={styles.modalContent}>
                                {loadingPropostas ? (
                                    <p>Carregando propostas...</p>
                                ) : propostas.length === 0 ? (
                                    <p>Nenhuma proposta recebida ainda.</p>
                                ) : (
                                    <div className={styles.propostasList}>
                                        {propostas.map(proposta => (
                                            <div key={proposta.id_proposta} className={styles.propostaItem}>
                                                <div className={styles.propostaInfo}>
                                                    <h4>{proposta.nome_prestador}</h4>
                                                    <p><strong>Valor:</strong> R$ {proposta.valor_proposto}</p>
                                                    {proposta.mensagem && (
                                                        <p><strong>Mensagem:</strong> {proposta.mensagem}</p>
                                                    )}
                                                </div>
                                                <button 
                                                    className={styles.acceptButton}
                                                    onClick={() => handleAcceptProposta(proposta.id_proposta)}
                                                >
                                                    Aceitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* O botão de solicitar novo serviço pode ser removido daqui se já estiver na navegação principal */}
                {/* {servicos.length > 0 && (
                    <div className={styles.actions}>
                        <button onClick={handleNavigateToCreateService} className={styles.mainButton}>
                            Solicitar Novo Serviço
                        </button>
                    </div>
                )} */}
            </main>
        </div>
    );
};

export default DashboardCliente;
