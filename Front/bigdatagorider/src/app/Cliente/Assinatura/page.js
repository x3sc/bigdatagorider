"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import styles from './assinatura.module.css';

const AssinaturaCliente = () => {
    const [planoAtual, setPlanoAtual] = useState('basico');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'cliente') {
            router.push('/Login');
            return;
        }
        buscarPlanoAtual();
    }, [router]);

    const buscarPlanoAtual = async () => {
        try {
            // Simulação - aqui seria a chamada real para o backend
            console.log('Plano atual:', 'basico');
        } catch (err) {
            console.error('Erro ao buscar plano atual:', err);
        }
    };

    const planos = [
        {
            id: 'basico',
            nome: 'Básico',
            preco: 0,
            cor: '#6B7280',
            popular: false,
            beneficios: [
                'Até 3 serviços por mês',
                'Suporte por email',
                'Acesso básico à plataforma',
                'Histórico de serviços básico'
            ],
            limitacoes: [
                'Sem prioridade nos serviços',
                'Sem desconto em serviços',
                'Suporte limitado'
            ]
        },
        {
            id: 'standard',
            nome: 'Standard',
            preco: 29.90,
            cor: '#3B82F6',
            popular: true,
            beneficios: [
                'Até 10 serviços por mês',
                'Suporte por email e chat',
                'Prioridade moderada nos serviços',
                '5% de desconto em todos os serviços',
                'Histórico detalhado',
                'Notificações em tempo real',
                'Relatórios mensais'
            ],
            limitacoes: [
                'Suporte limitado aos horários comerciais'
            ]
        },
        {
            id: 'premium',
            nome: 'Premium',
            preco: 49.90,
            cor: '#F59E0B',
            popular: false,
            beneficios: [
                'Serviços ilimitados',
                'Suporte 24/7 (email, chat, telefone)',
                'Máxima prioridade nos serviços',
                '15% de desconto em todos os serviços',
                'Relatórios avançados e analytics',
                'Acesso antecipado a novas funcionalidades',
                'Gerente de conta dedicado',
                'API para integração personalizada'
            ],
            limitacoes: []
        }
    ];

    const confirmarMudancaPlano = (plano) => {
        if (plano.id === planoAtual) {
            return;
        }
        setPlanoSelecionado(plano);
        setShowConfirmModal(true);
    };

    const processarMudancaPlano = async () => {
        try {
            // Simulação da chamada API
            setPlanoAtual(planoSelecionado.id);
            setShowConfirmModal(false);
            alert(`Plano alterado para ${planoSelecionado.nome} com sucesso!`);
        } catch (err) {
            alert('Erro ao alterar plano: ' + err.message);
        }
    };

    const getStatusChip = (planoId) => {
        if (planoId === planoAtual) {
            return <Chip color="success" variant="flat">Plano Atual</Chip>;
        }
        if (planos.findIndex(p => p.id === planoId) > planos.findIndex(p => p.id === planoAtual)) {
            return <Chip color="primary" variant="flat">Upgrade</Chip>;
        }
        return <Chip color="warning" variant="flat">Downgrade</Chip>;
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            
            <div className={styles.content}>
                <SecondaryNavigation 
                    currentPage="Assinatura"
                    userType="cliente"
                    userName="Cliente Demo"
                />
                
                <div className={styles.header}>
                    <h1>⭐ Planos de Assinatura</h1>
                    <p>Escolha o plano ideal para suas necessidades e aproveite ao máximo nossos serviços</p>
                </div>

                <div className={styles.planoAtualInfo}>
                    <Card className={styles.planoAtualCard}>
                        <CardBody>
                            <div className={styles.planoAtualContent}>
                                <h3>Seu Plano Atual</h3>
                                <div className={styles.planoAtualDetalhes}>
                                    <span className={styles.planoNome} style={{color: planos.find(p => p.id === planoAtual)?.cor}}>
                                        {planos.find(p => p.id === planoAtual)?.nome}
                                    </span>
                                    <span className={styles.planoPreco}>
                                        R$ {planos.find(p => p.id === planoAtual)?.preco.toFixed(2)}/mês
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className={styles.planosGrid}>
                    {planos.map((plano) => (
                        <Card 
                            key={plano.id} 
                            className={`${styles.planoCard} ${plano.popular ? styles.popular : ''} ${plano.id === planoAtual ? styles.atual : ''}`}
                        >
                            <CardHeader>
                                <div className={styles.planoHeader}>
                                    <div className={styles.planoTitulo}>
                                        <h3 style={{color: plano.cor}}>{plano.nome}</h3>
                                        {plano.popular && <Chip color="secondary" variant="solid" size="sm">Mais Popular</Chip>}
                                    </div>
                                    {getStatusChip(plano.id)}
                                </div>
                            </CardHeader>
                            
                            <CardBody>
                                <div className={styles.planoContent}>
                                    <div className={styles.preco}>
                                        <span className={styles.moeda}>R$</span>
                                        <span className={styles.valor}>{plano.preco.toFixed(2)}</span>
                                        <span className={styles.periodo}>/mês</span>
                                    </div>

                                    <Divider className={styles.divider} />

                                    <div className={styles.beneficios}>
                                        <h4>✅ Benefícios Inclusos:</h4>
                                        <ul>
                                            {plano.beneficios.map((beneficio, index) => (
                                                <li key={index}>{beneficio}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {plano.limitacoes.length > 0 && (
                                        <div className={styles.limitacoes}>
                                            <h4>⚠️ Limitações:</h4>
                                            <ul>
                                                {plano.limitacoes.map((limitacao, index) => (
                                                    <li key={index}>{limitacao}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button
                                        color={plano.id === planoAtual ? "default" : "primary"}
                                        variant={plano.id === planoAtual ? "flat" : "solid"}
                                        onPress={() => confirmarMudancaPlano(plano)}
                                        disabled={plano.id === planoAtual}
                                        className={styles.planoBtn}
                                        fullWidth
                                    >
                                        {plano.id === planoAtual ? 'Plano Atual' : 
                                         planos.findIndex(p => p.id === plano.id) > planos.findIndex(p => p.id === planoAtual) ? 
                                         'Fazer Upgrade' : 'Fazer Downgrade'}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className={styles.infoAdicional}>
                    <Card className={styles.infoCard}>
                        <CardBody>
                            <h3>📋 Informações Importantes</h3>
                            <ul>
                                <li>• Todos os planos incluem acesso ao painel de controle</li>
                                <li>• Você pode alterar seu plano a qualquer momento</li>
                                <li>• Upgrades são aplicados imediatamente</li>
                                <li>• Downgrades são aplicados no próximo ciclo de cobrança</li>
                                <li>• Sem taxas de cancelamento ou multas</li>
                                <li>• Suporte técnico disponível para todos os planos</li>
                                <li>• Descontos são aplicados automaticamente nos serviços</li>
                                <li>• Primeira semana grátis para novos assinantes Premium</li>
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Modal 
                isOpen={showConfirmModal} 
                onClose={() => setShowConfirmModal(false)}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>
                        <h2>Confirmar Alteração de Plano</h2>
                    </ModalHeader>
                    <ModalBody>
                        {planoSelecionado && (
                            <div className={styles.confirmacao}>
                                <p>
                                    Você está prestes a alterar seu plano de{' '}
                                    <strong>{planos.find(p => p.id === planoAtual)?.nome}</strong> para{' '}
                                    <strong style={{color: planoSelecionado.cor}}>{planoSelecionado.nome}</strong>.
                                </p>
                                
                                <div className={styles.resumoMudanca}>
                                    <p><strong>Novo valor:</strong> R$ {planoSelecionado.preco.toFixed(2)}/mês</p>
                                    {planoSelecionado.preco > planos.find(p => p.id === planoAtual)?.preco ? (
                                        <p className={styles.upgrade}>
                                            ⬆️ Você terá acesso imediato aos novos benefícios
                                        </p>
                                    ) : planoSelecionado.preco < planos.find(p => p.id === planoAtual)?.preco ? (
                                        <p className={styles.downgrade}>
                                            ⬇️ As alterações serão aplicadas no próximo ciclo
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="danger" 
                            variant="light" 
                            onPress={() => setShowConfirmModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onPress={processarMudancaPlano}
                        >
                            Confirmar Alteração
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AssinaturaCliente;
