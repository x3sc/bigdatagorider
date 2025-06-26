"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    Card, 
    CardBody, 
    CardHeader, 
    Input,
    Select,
    SelectItem,
    Chip,
    Spinner,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import { TIPOS_VEICULO } from '@/constants/vehicleTypes';
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
    const [success, setSuccess] = useState('');    const router = useRouter();

    // Carregar veículos existentes ao inicializar
    useEffect(() => {
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
    };    return (
        <div className={styles.pageContainer}>
            <Header />
            
            <main className={styles.main}>
                {/* Navegação Secundária */}
                <SecondaryNavigation />

                {/* Formulário de Cadastro */}
                <Card className={styles.contentCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>� Cadastrar Novo Veículo</h2>
                    </CardHeader>
                    <CardBody>
                        {error && (
                            <Card className={styles.errorCard}>
                                <CardBody>
                                    <p className={styles.errorText}>❌ {error}</p>
                                </CardBody>
                            </Card>
                        )}
                        
                        {success && (
                            <Card className={styles.successCard}>
                                <CardBody>
                                    <p className={styles.successText}>✅ {success}</p>
                                </CardBody>
                            </Card>
                        )}

                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div className={styles.formRow}>
                                <Input
                                    type="text"
                                    label="Placa *"
                                    placeholder="ABC-1234"
                                    value={formData.placa}
                                    onValueChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        placa: formatarPlaca(value)
                                    }))}
                                    variant="bordered"
                                    size="lg"
                                    maxLength={8}
                                    required
                                    classNames={{
                                        input: styles.input,
                                        inputWrapper: styles.inputWrapper
                                    }}
                                />

                                <Select
                                    label="Tipo de Veículo *"
                                    placeholder="Selecione o tipo"
                                    selectedKeys={[formData.tipo]}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0];
                                        setFormData(prev => ({ ...prev, tipo: value }));
                                    }}
                                    variant="bordered"
                                    size="lg"
                                    required
                                    classNames={{
                                        trigger: styles.inputWrapper
                                    }}
                                >
                                    {TIPOS_VEICULO.map((tipo) => (
                                        <SelectItem key={tipo.key} value={tipo.key}>
                                            {tipo.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="number"
                                    label="Ano de Fabricação *"
                                    placeholder="2020"
                                    value={formData.ano_fabricacao}
                                    onValueChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        ano_fabricacao: value
                                    }))}
                                    variant="bordered"
                                    size="lg"
                                    min={1990}
                                    max={new Date().getFullYear()}
                                    required
                                    classNames={{
                                        input: styles.input,
                                        inputWrapper: styles.inputWrapper
                                    }}
                                />

                                <Input
                                    type="number"
                                    label="Capacidade (Toneladas) *"
                                    placeholder="5.5"
                                    value={formData.capacidade_toneladas}
                                    onValueChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        capacidade_toneladas: value
                                    }))}
                                    variant="bordered"
                                    size="lg"
                                    min={0.1}
                                    step={0.1}
                                    required
                                    classNames={{
                                        input: styles.input,
                                        inputWrapper: styles.inputWrapper
                                    }}
                                />
                            </div>

                            <Button
                                type="submit"
                                color="danger"
                                size="lg"
                                className={styles.submitButton}
                                isLoading={loading}
                                fullWidth
                                startContent={!loading && <span>🚛</span>}
                            >
                                {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {/* Lista de Veículos */}
                <Card className={styles.contentCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>🚗 Meus Veículos ({veiculos.length})</h2>
                    </CardHeader>
                    <CardBody>
                        {veiculos.length === 0 ? (
                            <Card className={styles.emptyStateCard}>
                                <CardBody className={styles.emptyStateBody}>
                                    <div className={styles.emptyStateIcon}>🚛</div>
                                    <h3>Nenhum veículo cadastrado</h3>
                                    <p>Cadastre seus veículos para poder fazer propostas para serviços!</p>
                                </CardBody>
                            </Card>
                        ) : (
                            <Table 
                                aria-label="Tabela de veículos"
                                className={styles.vehiclesTable}
                                selectionMode="none"
                            >
                                <TableHeader>
                                    <TableColumn>TIPO</TableColumn>
                                    <TableColumn>PLACA</TableColumn>
                                    <TableColumn>ANO</TableColumn>
                                    <TableColumn>CAPACIDADE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {veiculos.map(veiculo => (
                                        <TableRow key={veiculo.id}>
                                            <TableCell>
                                                <div className={styles.vehicleInfo}>
                                                    <strong>{veiculo.tipo}</strong>
                                                </div>
                                            </TableCell>
                                            <TableCell>{veiculo.placa}</TableCell>
                                            <TableCell>{veiculo.ano_fabricacao}</TableCell>
                                            <TableCell>{veiculo.capacidade_toneladas}t</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    color={veiculo.status?.toLowerCase() === 'disponível' ? 'success' : 'warning'}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {veiculo.status || 'Disponível'}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>

                {/* Dicas */}
                <Card className={styles.tipsCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>💡 Dicas Importantes</h2>
                    </CardHeader>
                    <CardBody>
                        <div className={styles.tipsList}>
                            <div className={styles.tipItem}>
                                <span className={styles.tipIcon}>🚛</span>
                                <div>
                                    <strong>Diversifique sua frota:</strong>
                                    <p>Tenha veículos de diferentes tipos e capacidades para atender mais serviços</p>
                                </div>
                            </div>
                            <div className={styles.tipItem}>
                                <span className={styles.tipIcon}>📋</span>
                                <div>
                                    <strong>Mantenha informações atualizadas:</strong>
                                    <p>Certifique-se de que as placas e capacidades estão corretas</p>
                                </div>
                            </div>
                            <div className={styles.tipItem}>
                                <span className={styles.tipIcon}>📈</span>
                                <div>
                                    <strong>Múltiplas propostas:</strong>
                                    <p>Com mais veículos, você pode fazer propostas para serviços que exigem múltiplos veículos</p>
                                </div>
                            </div>
                            <div className={styles.tipItem}>
                                <span className={styles.tipIcon}>⚡</span>
                                <div>
                                    <strong>Status dos veículos:</strong>
                                    <p>Veículos em serviço não aparecem para novas propostas</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};

export default CadastrarVeiculos;
