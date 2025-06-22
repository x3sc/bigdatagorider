"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../Dashboard/dashboard.module.css';

const ServicosDisponiveis = () => {
    const [servicos, setServicos] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [selectedVeiculos, setSelectedVeiculos] = useState({});
    const [propostas, setPropostas] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }

        const fetchData = async () => {
            try {
                // Buscar serviços disponíveis
                const servicosResponse = await fetch('http://127.0.0.1:5000/api/prestador/servicos/espera', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Buscar veículos do prestador
                const veiculosResponse = await fetch('http://127.0.0.1:5000/api/prestador/veiculos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (servicosResponse.ok && veiculosResponse.ok) {
                    const servicosData = await servicosResponse.json();
                    const veiculosData = await veiculosResponse.json();
                    
                    setServicos(servicosData);
                    setVeiculos(veiculosData);
                } else {
                    setError('Erro ao carregar dados.');
                }
            } catch (err) {
                setError('Erro de conexão com o servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleVeiculoChange = (servicoId, veiculoId, checked) => {
        setSelectedVeiculos(prev => ({
            ...prev,
            [servicoId]: checked 
                ? [...(prev[servicoId] || []), veiculoId]
                : (prev[servicoId] || []).filter(id => id !== veiculoId)
        }));
    };

    const handlePropostaChange = (servicoId, field, value) => {
        setPropostas(prev => ({
            ...prev,
            [servicoId]: {
                ...prev[servicoId],
                [field]: value
            }
        }));
    };    const handleEnviarProposta = async (servicoId) => {
        const token = localStorage.getItem('token');
        const veiculosSelecionados = selectedVeiculos[servicoId] || [];
        const proposta = propostas[servicoId] || {};

        // Encontrar o serviço para verificar quantidade necessária
        const servico = servicos.find(s => s.id === servicoId);
        const quantidadeNecessaria = servico?.quantidade_veiculos || 1;

        if (veiculosSelecionados.length === 0) {
            alert('Selecione pelo menos um veículo para a proposta.');
            return;
        }

        if (veiculosSelecionados.length < quantidadeNecessaria) {
            alert(`Este serviço requer pelo menos ${quantidadeNecessaria} veículo(s). Você selecionou apenas ${veiculosSelecionados.length}.`);
            return;
        }

        if (!proposta.valor_proposto) {
            alert('Informe o valor da proposta.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/propostas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    veiculos_ids: veiculosSelecionados,
                    valor_proposto: parseFloat(proposta.valor_proposto),
                    mensagem: proposta.mensagem || ''
                }),
            });

            if (response.ok) {
                alert('Proposta enviada com sucesso!');
                // Limpar formulário
                setSelectedVeiculos(prev => ({ ...prev, [servicoId]: [] }));
                setPropostas(prev => ({ ...prev, [servicoId]: {} }));
            } else {
                const data = await response.json();
                alert(data.detail || 'Erro ao enviar proposta.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    return (
        <div className={styles.container}>
            {/* Navegação Principal */}
            <div className={styles.navPrincipal}>                <div className={styles.logo}>
                    <Image src="/assets/home/LOGO.png" alt="BigData Go Rider" width={120} height={40} />
                </div>                <nav className={styles.menu}>
                    <a href="/Prestador/Dashboard">Dashboard</a>
                    <a href="/Prestador/ServicosDisponiveis" className={styles.active}>Serviços Disponíveis</a>
                    <a href="/Prestador/CadastrarVeiculos">Cadastrar Veículos</a>
                    <a href="/Prestador/Perfil">Perfil</a>
                </nav>
                <div className={styles.userActions}>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/Login');
                        }}
                        className={styles.logoutBtn}
                    >
                        Sair
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <h1>Serviços Disponíveis</h1>
                {error && <p className={styles.error}>{error}</p>}
                
                {servicos.length > 0 ? (
                    <div className={styles.servicosGrid}>
                        {servicos.map(servico => (
                            <div key={servico.id} className={styles.servicoCard}>
                                <h3>{servico.nome}</h3>
                                <p><strong>Descrição:</strong> {servico.descricao}</p>
                                <p><strong>Cliente:</strong> {servico.cliente_nome}</p>
                                <p><strong>Origem:</strong> {servico.origem}</p>
                                <p><strong>Destino:</strong> {servico.destino}</p>
                                <p><strong>Data do Serviço:</strong> {servico.data_servico}</p>
                                <p><strong>Tipo de Veículo:</strong> {servico.tipo_veiculo_requerido}</p>
                                <p><strong>Quantidade de Veículos:</strong> {servico.quantidade_veiculos}</p>
                                <p><strong>Valor Inicial:</strong> R$ {servico.valor?.toFixed(2) || 'Não informado'}</p>                                <div className={styles.propostaForm}>
                                    <h4>🚛 Enviar Proposta</h4>
                                    
                                    <div className={styles.requirementInfo}>
                                        <span className={styles.requirement}>
                                            📋 Este serviço requer <strong>{servico.quantidade_veiculos}</strong> veículo(s)
                                        </span>
                                        <span className={styles.selected}>
                                            ✅ Selecionados: <strong>{(selectedVeiculos[servico.id] || []).length}</strong>
                                        </span>
                                    </div>
                                    
                                    <div className={styles.veiculosSelection}>
                                        <label>🚗 Selecione seus veículos disponíveis:</label>
                                        <div className={styles.veiculosGrid}>
                                            {veiculos.filter(v => v.status === 'Disponivel').map(veiculo => (
                                                <div key={veiculo.id} className={`${styles.veiculoCard} ${
                                                    (selectedVeiculos[servico.id] || []).includes(veiculo.id) ? styles.selected : ''
                                                }`}>
                                                    <input
                                                        type="checkbox"
                                                        id={`veiculo-${servico.id}-${veiculo.id}`}
                                                        checked={(selectedVeiculos[servico.id] || []).includes(veiculo.id)}
                                                        onChange={(e) => handleVeiculoChange(servico.id, veiculo.id, e.target.checked)}
                                                        className={styles.veiculoCheckbox}
                                                    />
                                                    <label htmlFor={`veiculo-${servico.id}-${veiculo.id}`} className={styles.veiculoLabel}>
                                                        <div className={styles.veiculoHeader}>
                                                            <strong>{veiculo.tipo}</strong>
                                                            <span className={styles.capacidade}>{veiculo.capacidade_toneladas}t</span>
                                                        </div>
                                                        <div className={styles.veiculoDetails}>
                                                            <span>🚗 {veiculo.placa}</span>
                                                            <span>📅 {veiculo.ano_fabricacao}</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {veiculos.filter(v => v.status === 'Disponivel').length === 0 && (
                                            <div className={styles.noVeiculos}>
                                                <p>❌ Você não possui veículos disponíveis.</p>
                                                <a href="/Prestador/CadastrarVeiculos" className={styles.cadastrarLink}>
                                                    ➕ Cadastrar Veículos
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Valor da Proposta (R$):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={propostas[servico.id]?.valor_proposto || ''}
                                            onChange={(e) => handlePropostaChange(servico.id, 'valor_proposto', e.target.value)}
                                            placeholder="Digite seu valor"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Mensagem (opcional):</label>
                                        <textarea
                                            value={propostas[servico.id]?.mensagem || ''}
                                            onChange={(e) => handlePropostaChange(servico.id, 'mensagem', e.target.value)}
                                            placeholder="Deixe uma mensagem para o cliente"
                                            rows="3"
                                        />
                                    </div>

                                    <button 
                                        onClick={() => handleEnviarProposta(servico.id)}
                                        className={styles.enviarBtn}
                                    >
                                        Enviar Proposta
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum serviço disponível no momento.</p>
                )}
            </div>
        </div>
    );
};

export default ServicosDisponiveis;
