"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderPrestador from '@/components/headerPrestador';
import styles from './cadastrarVeiculos.module.css';

const CadastrarVeiculos = () => {
    const [formData, setFormData] = useState({
        placa: '',
        tipo: 'Caminhão',
        ano_fabricacao: '',
        capacidade_toneladas: ''
    });
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Carregar veículos existentes ao inicializar
    useState(() => {
        const fetchVeiculos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/Login');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/api/prestador/veiculos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setVeiculos(data);
                }
            } catch (err) {
                console.error('Erro ao carregar veículos:', err);
            }
        };

        fetchVeiculos();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Você precisa estar logado.');
            router.push('/Login');
            return;
        }

        // Validações
        if (!formData.placa || !formData.tipo || !formData.ano_fabricacao || !formData.capacidade_toneladas) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        if (formData.ano_fabricacao < 1990 || formData.ano_fabricacao > new Date().getFullYear()) {
            setError('Ano de fabricação deve estar entre 1990 e o ano atual.');
            setLoading(false);
            return;
        }

        if (formData.capacidade_toneladas <= 0) {
            setError('Capacidade deve ser maior que zero.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/prestador/veiculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    placa: formData.placa.toUpperCase(),
                    tipo: formData.tipo,
                    ano_fabricacao: parseInt(formData.ano_fabricacao),
                    capacidade_toneladas: parseFloat(formData.capacidade_toneladas)
                })
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess('Veículo cadastrado com sucesso!');
                
                // Limpar formulário
                setFormData({
                    placa: '',
                    tipo: 'Caminhão',
                    ano_fabricacao: '',
                    capacidade_toneladas: ''
                });

                // Recarregar lista de veículos
                const listResponse = await fetch('http://127.0.0.1:5000/api/prestador/veiculos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (listResponse.ok) {
                    const veiculosData = await listResponse.json();
                    setVeiculos(veiculosData);
                }

            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Erro ao cadastrar veículo.');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const formatarPlaca = (placa) => {
        // Remove caracteres não alfanuméricos e converte para maiúsculo
        let placaLimpa = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        
        // Formata no padrão ABC-1234 ou ABC1D23 (Mercosul)
        if (placaLimpa.length <= 7) {
            if (placaLimpa.length > 3) {
                placaLimpa = placaLimpa.substring(0, 3) + '-' + placaLimpa.substring(3);
            }
        }
        
        return placaLimpa;
    };

    const handlePlacaChange = (e) => {
        const placaFormatada = formatarPlaca(e.target.value);
        setFormData(prev => ({
            ...prev,
            placa: placaFormatada
        }));
    };    return (        <div className={styles.container}>
            <HeaderPrestador />
            
            <div className={styles.content}>
                <h1>🚛 Cadastrar Veículos</h1>
                <p>Gerencie sua frota para poder fazer propostas para diferentes serviços</p>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                {/* Formulário de Cadastro */}
                <div className={styles.formSection}>
                    <h2>📝 Novo Veículo</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="placa">Placa *</label>
                                <input
                                    type="text"
                                    id="placa"
                                    name="placa"
                                    value={formData.placa}
                                    onChange={handlePlacaChange}
                                    placeholder="ABC-1234"
                                    maxLength="8"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="tipo">Tipo de Veículo *</label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Caminhão">Caminhão</option>
                                    <option value="Caminhão Baú">Caminhão Baú</option>
                                    <option value="Caminhão Graneleiro">Caminhão Graneleiro</option>
                                    <option value="Caminhão Frigorífico">Caminhão Frigorífico</option>
                                    <option value="Van">Van</option>
                                    <option value="Van Refrigerada">Van Refrigerada</option>
                                    <option value="Carreta">Carreta</option>
                                    <option value="Bitrem">Bitrem</option>
                                    <option value="Carro">Carro</option>
                                    <option value="Moto">Moto</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="ano_fabricacao">Ano de Fabricação *</label>
                                <input
                                    type="number"
                                    id="ano_fabricacao"
                                    name="ano_fabricacao"
                                    value={formData.ano_fabricacao}
                                    onChange={handleChange}
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    placeholder="2020"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="capacidade_toneladas">Capacidade (Toneladas) *</label>
                                <input
                                    type="number"
                                    id="capacidade_toneladas"
                                    name="capacidade_toneladas"
                                    value={formData.capacidade_toneladas}
                                    onChange={handleChange}
                                    min="0.1"
                                    step="0.1"
                                    placeholder="5.5"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Cadastrando...' : '🚛 Cadastrar Veículo'}
                        </button>
                    </form>
                </div>

                {/* Lista de Veículos Cadastrados */}
                <div className={styles.veiculosSection}>
                    <h2>🚗 Meus Veículos ({veiculos.length})</h2>
                    
                    {veiculos.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Você ainda não possui veículos cadastrados.</p>
                            <p>Cadastre seus veículos para poder fazer propostas para serviços!</p>
                        </div>
                    ) : (
                        <div className={styles.veiculosGrid}>
                            {veiculos.map((veiculo) => (
                                <div key={veiculo.id} className={styles.veiculoCard}>
                                    <div className={styles.veiculoHeader}>
                                        <h3>{veiculo.tipo}</h3>
                                        <span className={`${styles.status} ${styles[veiculo.status?.toLowerCase()]}`}>
                                            {veiculo.status}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.veiculoInfo}>
                                        <div className={styles.infoItem}>
                                            <strong>📋 Placa:</strong> {veiculo.placa}
                                        </div>
                                        <div className={styles.infoItem}>
                                            <strong>📅 Ano:</strong> {veiculo.ano_fabricacao}
                                        </div>
                                        <div className={styles.infoItem}>
                                            <strong>⚖️ Capacidade:</strong> {veiculo.capacidade_toneladas}t
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dicas */}
                <div className={styles.tipsSection}>
                    <h3>💡 Dicas Importantes</h3>
                    <ul>
                        <li><strong>Diversifique sua frota:</strong> Tenha veículos de diferentes tipos e capacidades para atender mais serviços</li>
                        <li><strong>Mantenha informações atualizadas:</strong> Certifique-se de que as placas e capacidades estão corretas</li>
                        <li><strong>Múltiplas propostas:</strong> Com mais veículos, você pode fazer propostas para serviços que exigem múltiplos veículos</li>
                        <li><strong>Status dos veículos:</strong> Veículos em serviço não aparecem para novas propostas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CadastrarVeiculos;
