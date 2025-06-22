"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox, CheckboxGroup } from '@heroui/react';
import HeaderPrestador from '@/components/headerPrestador';
import styles from './servicosPublicados.module.css';

const ServicosPublicados = () => {
    const [servicos, setServicos] = useState([]);
    const [servicosFiltrados, setServicosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        nome: '',
        tipoVeiculo: '',
        dataInicio: ''
    });
    const [showPropostaModal, setShowPropostaModal] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [veiculos, setVeiculos] = useState([]);
    const [veiculosSelecionados, setVeiculosSelecionados] = useState([]);
    const [valorProposto, setValorProposto] = useState('');
    const [mensagemProposta, setMensagemProposta] = useState('');
    
    const router = useRouter();

    const tiposVeiculo = [
        { key: "caminhao", label: "Caminhão" },
        { key: "van", label: "Van" },
        { key: "moto", label: "Moto" },
        { key: "carro", label: "Carro" },
        { key: "carreta", label: "Carreta" }
    ];    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }
        buscarServicos();
        buscarVeiculos();
    }, [router]);

    useEffect(() => {
        filtrarServicos();
    }, [servicos, filtros, filtrarServicos]);

    const buscarServicos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/servicos/disponiveis', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setServicos(data);
            } else {
                setError('Erro ao carregar serviços');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const buscarVeiculos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/prestador/veiculos', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setVeiculos(data);
            }
        } catch (err) {
            console.error('Erro ao buscar veículos:', err);
        }
    };    const filtrarServicos = useCallback(() => {
        let servicosFilt = [...servicos];

        if (filtros.nome) {
            servicosFilt = servicosFilt.filter(servico => 
                servico.descricao?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.origem?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.destino?.toLowerCase().includes(filtros.nome.toLowerCase())
            );
        }

        if (filtros.tipoVeiculo) {
            servicosFilt = servicosFilt.filter(servico => 
                servico.tipo_veiculo === filtros.tipoVeiculo
            );
        }

        if (filtros.dataInicio) {
            servicosFilt = servicosFilt.filter(servico => {
                const dataServico = new Date(servico.data_inicio);
                const dataFiltro = new Date(filtros.dataInicio);
                return dataServico >= dataFiltro;
            });
        }

        setServicosFiltrados(servicosFilt);
    }, [servicos, filtros]);

    const abrirModalProposta = (servico) => {
        setServicoSelecionado(servico);
        setVeiculosSelecionados([]);
        setValorProposto('');
        setMensagemProposta('');
        setShowPropostaModal(true);
    };

    const enviarProposta = async () => {
        try {
            if (veiculosSelecionados.length === 0) {
                alert('Selecione pelo menos um veículo');
                return;
            }

            if (veiculosSelecionados.length > servicoSelecionado.quantidade_veiculos) {
                alert(`Máximo de ${servicoSelecionado.quantidade_veiculos} veículos permitidos`);
                return;
            }

            if (!valorProposto) {
                alert('Informe o valor da proposta');
                return;
            }

            const token = localStorage.getItem('token');
            
            // Enviar uma proposta para cada veículo selecionado
            for (const veiculoId of veiculosSelecionados) {
                const response = await fetch('http://localhost:8000/propostas/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_servico: servicoSelecionado.id,
                        id_veiculo: parseInt(veiculoId),
                        valor_proposto: parseFloat(valorProposto),
                        mensagem: mensagemProposta
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erro ao enviar proposta para veículo ${veiculoId}`);
                }
            }

            alert('Propostas enviadas com sucesso!');
            setShowPropostaModal(false);
            buscarServicos(); // Recarregar a lista
        } catch (err) {
            alert('Erro ao enviar proposta: ' + err.message);
        }
    };

    const getVeiculosDisponiveis = () => {
        // Filtrar veículos do tipo necessário e que não estão em uso
        return veiculos.filter(veiculo => 
            veiculo.tipo === servicoSelecionado?.tipo_veiculo && 
            veiculo.status === 'disponivel'
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <HeaderPrestador />
                <div className={styles.loading}>Carregando serviços...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <HeaderPrestador />
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <HeaderPrestador />
            
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>🔍 Buscar Serviços Disponíveis</h1>
                    <p>Encontre serviços publicados pelos clientes e envie suas propostas</p>
                </div>

                {/* Filtros */}
                <Card className={styles.filtrosCard}>
                    <CardHeader>
                        <h3>Filtrar Serviços</h3>
                    </CardHeader>
                    <CardBody>
                        <div className={styles.filtros}>
                            <Input
                                label="Buscar por descrição, origem ou destino"
                                placeholder="Digite para buscar..."
                                value={filtros.nome}
                                onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
                                className={styles.filtroInput}
                            />
                            
                            <Select
                                label="Tipo de Veículo"
                                placeholder="Selecione o tipo"
                                selectedKeys={filtros.tipoVeiculo ? [filtros.tipoVeiculo] : []}
                                onSelectionChange={(keys) => setFiltros({...filtros, tipoVeiculo: Array.from(keys)[0] || ''})}
                                className={styles.filtroSelect}
                            >
                                {tiposVeiculo.map((tipo) => (
                                    <SelectItem key={tipo.key} value={tipo.key}>
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                type="date"
                                label="Data de início mínima"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                                className={styles.filtroInput}
                            />

                            <Button
                                color="primary"
                                onPress={() => setFiltros({nome: '', tipoVeiculo: '', dataInicio: ''})}
                                variant="flat"
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Lista de Serviços */}
                <div className={styles.servicosGrid}>
                    {servicosFiltrados.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <CardBody>
                                <p>Nenhum serviço encontrado com os filtros aplicados</p>
                            </CardBody>
                        </Card>
                    ) : (
                        servicosFiltrados.map((servico) => (
                            <Card key={servico.id} className={styles.servicoCard}>
                                <CardHeader>
                                    <div className={styles.servicoHeader}>
                                        <h3>{servico.descricao}</h3>
                                        <Chip color="primary" variant="flat">
                                            {tiposVeiculo.find(t => t.key === servico.tipo_veiculo)?.label}
                                        </Chip>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles.servicoInfo}>
                                        <p><strong>Origem:</strong> {servico.origem}</p>
                                        <p><strong>Destino:</strong> {servico.destino}</p>
                                        <p><strong>Data de início:</strong> {new Date(servico.data_inicio).toLocaleDateString()}</p>
                                        <p><strong>Data limite:</strong> {new Date(servico.data_limite).toLocaleDateString()}</p>
                                        <p><strong>Veículos necessários:</strong> {servico.quantidade_veiculos}</p>
                                        <p><strong>Valor sugerido:</strong> R$ {servico.valor?.toFixed(2)}</p>
                                    </div>
                                    
                                    <Button
                                        color="primary"
                                        onPress={() => abrirModalProposta(servico)}
                                        className={styles.propostaBtn}
                                        fullWidth
                                    >
                                        Fazer Proposta
                                    </Button>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Modal de Proposta */}
            <Modal 
                isOpen={showPropostaModal} 
                onClose={() => setShowPropostaModal(false)}
                size="2xl"
            >
                <ModalContent>
                    <ModalHeader>
                        <h2>Fazer Proposta para Serviço</h2>
                    </ModalHeader>
                    <ModalBody>
                        {servicoSelecionado && (
                            <div className={styles.modalContent}>
                                <Card className={styles.servicoResumo}>
                                    <CardBody>
                                        <h3>{servicoSelecionado.descricao}</h3>
                                        <p><strong>Rota:</strong> {servicoSelecionado.origem} → {servicoSelecionado.destino}</p>
                                        <p><strong>Veículos necessários:</strong> {servicoSelecionado.quantidade_veiculos}</p>
                                        <p><strong>Tipo:</strong> {tiposVeiculo.find(t => t.key === servicoSelecionado.tipo_veiculo)?.label}</p>
                                    </CardBody>
                                </Card>

                                <div className={styles.veiculosDisponiveis}>
                                    <h4>Selecione seus veículos (máx. {servicoSelecionado.quantidade_veiculos}):</h4>
                                    <CheckboxGroup
                                        value={veiculosSelecionados}
                                        onValueChange={setVeiculosSelecionados}
                                        className={styles.veiculosCheckboxGroup}
                                    >
                                        {getVeiculosDisponiveis().map((veiculo) => (
                                            <Checkbox 
                                                key={veiculo.id} 
                                                value={veiculo.id.toString()}
                                                className={styles.veiculoCheckbox}
                                            >
                                                <div className={styles.veiculoInfo}>
                                                    <strong>{veiculo.modelo}</strong> - {veiculo.placa}
                                                    <br />
                                                    <small>Capacidade: {veiculo.capacidade_kg}kg</small>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                    
                                    {getVeiculosDisponiveis().length === 0 && (
                                        <p className={styles.noVeiculos}>
                                            Você não possui veículos disponíveis do tipo necessário.
                                        </p>
                                    )}
                                </div>

                                <Input
                                    type="number"
                                    label="Valor da Proposta (R$)"
                                    placeholder="0.00"
                                    value={valorProposto}
                                    onChange={(e) => setValorProposto(e.target.value)}
                                    startContent={<span>R$</span>}
                                />

                                <Input
                                    label="Mensagem (opcional)"
                                    placeholder="Adicione informações extras sobre sua proposta..."
                                    value={mensagemProposta}
                                    onChange={(e) => setMensagemProposta(e.target.value)}
                                />
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="danger" 
                            variant="light" 
                            onPress={() => setShowPropostaModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onPress={enviarProposta}
                            isDisabled={veiculosSelecionados.length === 0 || !valorProposto}
                        >
                            Enviar Proposta
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ServicosPublicados;
