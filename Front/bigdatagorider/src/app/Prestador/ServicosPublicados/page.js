"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    Card, 
    CardBody, 
    CardHeader, 
    Input, 
    Select, 
    SelectItem, 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Chip, 
    Checkbox, 
    CheckboxGroup, 
    Textarea,
    Spinner
} from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import { TIPOS_VEICULO } from '@/constants/vehicleTypes';
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
    const [enviandoProposta, setEnviandoProposta] = useState(false);
    
    const router = useRouter();

    // Função para filtrar serviços
    const filtrarServicos = useCallback(() => {
        let servicosFilt = [...servicos];

        if (filtros.nome) {
            servicosFilt = servicosFilt.filter(servico => 
                servico.nome?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.descricao?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.origem?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.destino?.toLowerCase().includes(filtros.nome.toLowerCase()) ||
                servico.cliente_nome?.toLowerCase().includes(filtros.nome.toLowerCase())
            );
        }

        if (filtros.tipoVeiculo) {
            servicosFilt = servicosFilt.filter(servico => 
                servico.tipo_veiculo === filtros.tipoVeiculo
            );
        }

        if (filtros.dataInicio) {
            servicosFilt = servicosFilt.filter(servico => {
                const dataServico = new Date(servico.data_servico);
                const dataFiltro = new Date(filtros.dataInicio);
                return dataServico >= dataFiltro;
            });
        }

        setServicosFiltrados(servicosFilt);
    }, [servicos, filtros]);

    // Verificar autenticação e carregar dados
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'prestador') {
            router.push('/Login');
            return;
        }
        
        buscarServicos();
        buscarVeiculos();
    }, [router]);

    // Aplicar filtros quando servicos ou filtros mudarem
    useEffect(() => {
        filtrarServicos();
    }, [filtrarServicos]);

    // Buscar serviços publicados do backend
    const buscarServicos = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            console.log('Buscando serviços publicados...');
            const response = await fetch('http://localhost:5000/api/servicos/publicados', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Serviços carregados:', data);
                setServicos(data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao buscar serviços');
            }
        } catch (err) {
            console.error('Erro ao buscar serviços:', err);
            setError(`Erro ao carregar serviços: ${err.message}`);
            setServicos([]);
        } finally {
            setLoading(false);
        }
    };

    // Buscar veículos do prestador
    const buscarVeiculos = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Buscando veículos do prestador...');
            
            const response = await fetch('http://localhost:5000/api/prestador/veiculos', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Veículos carregados:', data);
                setVeiculos(data);
            } else {
                console.error('Erro ao buscar veículos');
                setVeiculos([]);
            }
        } catch (err) {
            console.error('Erro ao buscar veículos:', err);
            setVeiculos([]);
        }
    };

    // Abrir modal de proposta
    const abrirModalProposta = (servico) => {
        setServicoSelecionado(servico);
        setShowPropostaModal(true);
        setVeiculosSelecionados([]);
        setValorProposto(servico.valor?.toString() || '');
        setMensagemProposta('');
    };

    // Fechar modal de proposta
    const fecharModalProposta = () => {
        setShowPropostaModal(false);
        setServicoSelecionado(null);
        setVeiculosSelecionados([]);
        setValorProposto('');
        setMensagemProposta('');
    };

    // Enviar proposta
    const enviarProposta = async () => {
        try {
            setEnviandoProposta(true);

            if (veiculosSelecionados.length === 0) {
                alert('Selecione pelo menos um veículo');
                return;
            }

            if (veiculosSelecionados.length > servicoSelecionado.quantidade_veiculos) {
                alert(`Máximo de ${servicoSelecionado.quantidade_veiculos} veículos permitidos`);
                return;
            }

            if (!valorProposto || parseFloat(valorProposto) <= 0) {
                alert('Informe um valor válido para a proposta');
                return;
            }

            const token = localStorage.getItem('token');
            
            // Preparar dados da proposta
            const propostaData = {
                veiculos_ids: veiculosSelecionados.map(id => parseInt(id)),
                valor_proposto: parseFloat(valorProposto),
                mensagem: mensagemProposta || null
            };

            console.log('Enviando proposta:', propostaData);

            const response = await fetch(`http://localhost:5000/api/servicos/${servicoSelecionado.id}/propostas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(propostaData)
            });

            if (response.ok) {
                alert('Proposta enviada com sucesso!');
                fecharModalProposta();
                buscarServicos(); // Recarregar lista
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao enviar proposta');
            }

        } catch (error) {
            console.error('Erro ao enviar proposta:', error);
            alert(`Erro ao enviar proposta: ${error.message}`);
        } finally {
            setEnviandoProposta(false);
        }
    };

    // Obter veículos disponíveis para o serviço
    const getVeiculosDisponiveis = () => {
        if (!servicoSelecionado) return [];
        
        return veiculos.filter(veiculo => 
            veiculo.tipo === servicoSelecionado.tipo_veiculo && 
            veiculo.status === 'Disponivel'
        );
    };

    // Limpar filtros
    const limparFiltros = () => {
        setFiltros({nome: '', tipoVeiculo: '', dataInicio: ''});
    };

    // Formatação de data
    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    // Renderização durante carregamento
    if (loading) {
        return (
            <div>
                <Header />
                <SecondaryNavigation />
                <div className={styles.container}>
                    <div className={styles.loadingContainer}>
                        <Spinner size="lg" />
                        <p>Carregando serviços disponíveis...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <SecondaryNavigation />
            
            <div className={styles.container}>
                {/* Cabeçalho */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Serviços Publicados</h1>
                    <p className={styles.subtitle}>
                        Encontre serviços disponíveis e envie suas propostas
                    </p>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <Card className={styles.errorCard}>
                        <CardBody>
                            <p className={styles.errorMessage}>❌ {error}</p>
                            <Button 
                                color="primary" 
                                size="sm" 
                                onPress={buscarServicos}
                                className={styles.retryButton}
                            >
                                Tentar Novamente
                            </Button>
                        </CardBody>
                    </Card>
                )}

                {/* Filtros */}
                <Card className={styles.filterCard}>
                    <CardHeader>
                        <h2>🔍 Filtros de Busca</h2>
                    </CardHeader>
                    <CardBody>
                        <div className={styles.filterGrid}>
                            <Input
                                label="Buscar"
                                placeholder="Nome, descrição, origem, destino ou cliente..."
                                value={filtros.nome}
                                onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
                                clearable
                            />
                            
                            <Select
                                label="Tipo de Veículo"
                                placeholder="Todos os tipos"
                                selectedKeys={filtros.tipoVeiculo ? [filtros.tipoVeiculo] : []}
                                onSelectionChange={(keys) => setFiltros({...filtros, tipoVeiculo: Array.from(keys)[0] || ''})}
                            >
                                {TIPOS_VEICULO.map((tipo) => (
                                    <SelectItem key={tipo.key} value={tipo.key}>
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            
                            <Input
                                type="date"
                                label="Data mínima"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                            />
                            
                            <Button 
                                color="secondary" 
                                variant="flat"
                                onPress={limparFiltros}
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Contador de resultados */}
                <div className={styles.resultCount}>
                    <p>
                        {servicosFiltrados.length === 0 
                            ? 'Nenhum serviço encontrado' 
                            : `${servicosFiltrados.length} serviço(s) encontrado(s)`
                        }
                    </p>
                </div>

                {/* Lista de Serviços */}
                <div className={styles.servicosGrid}>
                    {servicosFiltrados.length === 0 ? (
                        <Card className={styles.emptyCard}>
                            <CardBody className={styles.emptyContent}>
                                <div className={styles.emptyIcon}>📦</div>
                                <h3>Nenhum serviço encontrado</h3>
                                <p>
                                    {servicos.length === 0 
                                        ? 'Não há serviços publicados no momento.'
                                        : 'Tente ajustar os filtros de busca.'
                                    }
                                </p>
                                {servicos.length === 0 && (
                                    <Button 
                                        color="primary" 
                                        onPress={buscarServicos}
                                        className={styles.refreshButton}
                                    >
                                        Atualizar Lista
                                    </Button>
                                )}
                            </CardBody>
                        </Card>
                    ) : (
                        servicosFiltrados.map((servico) => (
                            <Card key={servico.id} className={styles.servicoCard}>
                                <CardHeader className={styles.servicoHeader}>
                                    <div className={styles.servicoTitleSection}>
                                        <h3 className={styles.servicoTitle}>{servico.nome}</h3>
                                        <Chip 
                                            color="primary" 
                                            size="sm"
                                            className={styles.tipoChip}
                                        >
                                            {TIPOS_VEICULO.find(t => t.key === servico.tipo_veiculo)?.label || servico.tipo_veiculo}
                                        </Chip>
                                    </div>
                                    <div className={styles.servicoPrice}>
                                        <span className={styles.currencySymbol}>R$</span>
                                        <span className={styles.priceValue}>
                                            {servico.valor?.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </CardHeader>
                                
                                <CardBody className={styles.servicoBody}>
                                    <div className={styles.servicoInfo}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>👤 Cliente:</span>
                                            <span className={styles.value}>{servico.cliente_nome}</span>
                                        </div>
                                        
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>📝 Descrição:</span>
                                            <span className={styles.value}>{servico.descricao}</span>
                                        </div>
                                        
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>📍 Origem:</span>
                                            <span className={styles.value}>{servico.origem}</span>
                                        </div>
                                        
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>🎯 Destino:</span>
                                            <span className={styles.value}>{servico.destino}</span>
                                        </div>
                                        
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>📅 Data do Serviço:</span>
                                            <span className={styles.value}>{formatarData(servico.data_servico)}</span>
                                        </div>
                                        
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>🚛 Veículos Necessários:</span>
                                            <span className={styles.value}>{servico.quantidade_veiculos}</span>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        color="primary"
                                        size="lg"
                                        className={styles.propostaButton}
                                        onPress={() => abrirModalProposta(servico)}
                                    >
                                        💰 Enviar Proposta
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
                onClose={fecharModalProposta} 
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader className={styles.modalHeader}>
                        💰 Enviar Proposta
                    </ModalHeader>
                    <ModalBody>
                        {servicoSelecionado && (
                            <div className={styles.propostaContent}>
                                {/* Detalhes do Serviço */}
                                <Card className={styles.servicoDetalhes}>
                                    <CardHeader>
                                        <h4>📦 Detalhes do Serviço</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles.detalhesGrid}>
                                            <p><strong>Nome:</strong> {servicoSelecionado.nome}</p>
                                            <p><strong>Cliente:</strong> {servicoSelecionado.cliente_nome}</p>
                                            <p><strong>Origem:</strong> {servicoSelecionado.origem}</p>
                                            <p><strong>Destino:</strong> {servicoSelecionado.destino}</p>
                                            <p><strong>Data:</strong> {formatarData(servicoSelecionado.data_servico)}</p>
                                            <p><strong>Tipo de Veículo:</strong> {TIPOS_VEICULO.find(t => t.key === servicoSelecionado.tipo_veiculo)?.label}</p>
                                            <p><strong>Quantidade Necessária:</strong> {servicoSelecionado.quantidade_veiculos} veículo(s)</p>
                                            <p><strong>Valor Inicial:</strong> R$ {servicoSelecionado.valor?.toFixed(2)}</p>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Seleção de Veículos */}
                                <Card className={styles.veiculosCard}>
                                    <CardHeader>
                                        <h4>🚛 Selecione seus Veículos (máx. {servicoSelecionado.quantidade_veiculos})</h4>
                                    </CardHeader>
                                    <CardBody>
                                        {getVeiculosDisponiveis().length === 0 ? (
                                            <div className={styles.noVeiculos}>
                                                <p>⚠️ Você não possui veículos do tipo &ldquo;{servicoSelecionado.tipo_veiculo}&rdquo; disponíveis.</p>
                                                <p>Cadastre veículos na seção &ldquo;Meus Veículos&rdquo; para enviar propostas.</p>
                                            </div>
                                        ) : (
                                            <CheckboxGroup
                                                value={veiculosSelecionados}
                                                onValueChange={setVeiculosSelecionados}
                                                orientation="vertical"
                                            >
                                                {getVeiculosDisponiveis().map((veiculo) => (
                                                    <Checkbox 
                                                        key={veiculo.id} 
                                                        value={veiculo.id.toString()}
                                                        className={styles.veiculoCheckbox}
                                                    >
                                                        <div className={styles.veiculoOption}>
                                                            <div className={styles.veiculoInfo}>
                                                                <span className={styles.veiculoTipo}>
                                                                    <strong>{veiculo.tipo}</strong>
                                                                </span>
                                                                <span className={styles.veiculoPlaca}>
                                                                    Placa: {veiculo.placa}
                                                                </span>
                                                                <span className={styles.veiculoCapacidade}>
                                                                    Capacidade: {veiculo.capacidade_toneladas}t
                                                                </span>
                                                                <span className={styles.veiculoAno}>
                                                                    Ano: {veiculo.ano_fabricacao}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        )}
                                    </CardBody>
                                </Card>

                                {/* Formulário da Proposta */}
                                <Card className={styles.propostaForm}>
                                    <CardHeader>
                                        <h4>💰 Detalhes da Proposta</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles.formFields}>
                                            <Input
                                                type="number"
                                                label="Valor da Proposta (R$)"
                                                value={valorProposto}
                                                onChange={(e) => setValorProposto(e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">R$</span>
                                                    </div>
                                                }
                                            />
                                            
                                            <Textarea
                                                label="Mensagem (opcional)"
                                                value={mensagemProposta}
                                                onChange={(e) => setMensagemProposta(e.target.value)}
                                                placeholder="Descreva detalhes da sua proposta, condições especiais, prazo de entrega, etc..."
                                                rows={4}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="danger" 
                            variant="light" 
                            onPress={fecharModalProposta}
                            isDisabled={enviandoProposta}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onPress={enviarProposta}
                            isDisabled={
                                veiculosSelecionados.length === 0 || 
                                !valorProposto || 
                                parseFloat(valorProposto) <= 0 ||
                                enviandoProposta
                            }
                            isLoading={enviandoProposta}
                        >
                            {enviandoProposta ? 'Enviando...' : 'Enviar Proposta'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ServicosPublicados;
