"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import HeaderPrestador from '@/components/headerPrestador';

const DashboardPrestador = () => {
    const [activeTab, setActiveTab] = useState('Espera'); // Mudando para seguir padrão do cliente
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPropostaModal, setShowPropostaModal] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [proposta, setProposta] = useState({
        id_veiculo: '',
        valor_proposto: '',
        mensagem: ''
    });
    const router = useRouter();    useEffect(() => {
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
                // Mapeia a aba para o status esperado pelo backend
                const status = activeTab === 'Em Andamento' ? 'andamento' : 
                              activeTab === 'Finalizado' ? 'finalizado' : 'espera';

                const response = await fetch(`http://127.0.0.1:5000/api/prestador/servicos/${status}`, {
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
    }, [router, activeTab]);    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleEnviarProposta = (servico) => {
        setServicoSelecionado(servico);
        setShowPropostaModal(true);
    };

    const handleSubmitProposta = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoSelecionado.id}/propostas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_veiculo: parseInt(proposta.id_veiculo),
                    valor_proposto: parseFloat(proposta.valor_proposto),
                    mensagem: proposta.mensagem
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar proposta.');
            }

            // Fecha o modal e limpa os dados
            setShowPropostaModal(false);
            setProposta({ id_veiculo: '', valor_proposto: '', mensagem: '' });
            
            // Atualiza a lista de serviços
            setActiveTab('Em Andamento');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFinalizarServico = async (servicoId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/finalizar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao finalizar o serviço.');
            }

            // Atualiza a lista de serviços
            setActiveTab('Finalizado');
        } catch (err) {
            setError(err.message);
        }
    };

    const closeModal = () => {
        setShowPropostaModal(false);
        setServicoSelecionado(null);
        setProposta({ id_veiculo: '', valor_proposto: '', mensagem: '' });
    };    const renderServicos = () => {
        if (loading) return <p className={styles.message}>Carregando serviços...</p>;
        if (error) return <p className={`${styles.message} ${styles.error}`}>Erro: {error}</p>;
        if (servicos.length === 0) {
            return (
                <div className={styles.noServicesContainer}>
                    <p className={styles.message}>Nenhum serviço encontrado para esta categoria.</p>                    {activeTab === 'Espera' && (
                        <button onClick={() => router.push('/Prestador/ServicosDisponiveis')} className={styles.mainButton}>
                            Procurar Novos Transportes
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
                        <th>CLIENTE</th>
                        <th>DATA</th>
                        <th>STATUS</th>
                        <th>AÇÃO</th>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(servico => (
                        <tr key={servico.id}>
                            <td>{servico.nome}</td>
                            <td>{servico.cliente_nome}</td>
                            <td>{new Date(servico.data_servico).toLocaleDateString()}</td>
                            <td>
                                <span className={`${styles.status} ${styles[servico.status.toLowerCase().replace(/ /g, '-')]}`}>
                                    {servico.status}
                                </span>
                            </td>
                            <td>
                                {activeTab === 'Espera' && (
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleEnviarProposta(servico)}
                                    >
                                        Enviar Proposta
                                    </button>
                                )}
                                {activeTab === 'Em Andamento' && (
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleFinalizarServico(servico.id)}
                                    >
                                        Finalizar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };    return (
        <div className={styles.pageContainer}>
            <HeaderPrestador />
            <main className={styles.main}>                <div className={styles.mainTabs}>
                    <button
                        onClick={() => router.push('/Prestador/ServicosDisponiveis')}
                    >
                        Procurar transportes
                    </button>
                    <button className={styles.activeMainTab}>
                        Meus Serviços
                    </button>
                    <button
                        onClick={() => router.push('/Prestador/CadastrarVeiculos')}
                    >
                        Meus Veículos
                    </button>
                    <button onClick={() => alert('Planos de assinatura em breve!')}>
                        Planos de assinatura
                    </button>
                </div><div className={styles.content}>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Espera' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Espera')}
                        >
                            Espera
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Em Andamento' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Em Andamento')}
                        >
                            Em Andamento
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'Finalizado' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('Finalizado')}
                        >
                            Finalizado
                        </button>
                    </div>

                    {renderServicos()}
                </div>

                {/* Modal de Proposta */}
                {showPropostaModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>Enviar Proposta para: {servicoSelecionado?.nome}</h3>
                                <button className={styles.closeButton} onClick={closeModal}>×</button>
                            </div>
                            <div className={styles.modalContent}>
                                <div className={styles.formGroup}>
                                    <label>ID do Veículo:</label>
                                    <input
                                        type="number"
                                        value={proposta.id_veiculo}
                                        onChange={(e) => setProposta({...proposta, id_veiculo: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Valor Proposto (R$):</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={proposta.valor_proposto}
                                        onChange={(e) => setProposta({...proposta, valor_proposto: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Mensagem (opcional):</label>
                                    <textarea
                                        value={proposta.mensagem}
                                        onChange={(e) => setProposta({...proposta, mensagem: e.target.value})}
                                        rows="3"
                                    />
                                </div>
                                <button 
                                    className={styles.submitButton}
                                    onClick={handleSubmitProposta}
                                >
                                    Enviar Proposta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPrestador;