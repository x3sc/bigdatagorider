"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import styles from './assinatura.module.css';

const AssinaturaPrestador = () => {
    const [planoAtual, setPlanoAtual] = useState('bronze'); // Simulando plano atual
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const router = useRouter();    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }
        // Aqui você pode buscar o plano atual do prestador
        buscarPlanoAtual();
    }, [router]);

    const buscarPlanoAtual = async () => {
        try {
            const token = localStorage.getItem('token');
            // Aqui seria a chamada para buscar o plano atual
            // const response = await fetch('http://localhost:8000/prestador/plano', {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     }
            // });
            // Por agora, mantemos como bronze
        } catch (err) {
            console.error('Erro ao buscar plano atual:', err);
        }
    };

    const planos = [
        {
            id: 'bronze',
            nome: 'Bronze',
            preco: 20.00,
            cor: '#cd7f32',
            popular: false,
            beneficios: [
                'Até 5 propostas por mês',
                'Acesso a serviços básicos',
                'Suporte por email',
                'Dashboard básico',
                'Cadastro de até 2 veículos'
            ],
            limitacoes: [
                'Sem prioridade nas propostas',
                'Sem acesso a relatórios avançados'
            ]
        },
        {
            id: 'prata',
            nome: 'Prata',
            preco: 50.00,
            cor: '#c0c0c0',
            popular: true,
            beneficios: [
                'Até 20 propostas por mês',
                'Prioridade média nas propostas',
                'Acesso a todos os tipos de serviços',
                'Suporte por chat',
                'Dashboard avançado',
                'Cadastro de até 5 veículos',
                'Relatórios mensais',
                'Notificações em tempo real'
            ],
            limitacoes: [
                'Suporte limitado aos horários comerciais'
            ]
        },
        {
            id: 'gold',
            nome: 'Gold',
            preco: 100.00,
            cor: '#ffd700',
            popular: false,
            beneficios: [
                'Propostas ilimitadas',
                'Máxima prioridade nas propostas',
                'Acesso exclusivo a serviços premium',
                'Suporte 24/7 prioritário',
                'Dashboard completo com analytics',
                'Veículos ilimitados',
                'Relatórios detalhados e exportação',
                'API para integração',
                'Notificações personalizadas',
                'Gerente de conta dedicado'
            ],
            limitacoes: []
        }
    ];

    const confirmarMudancaPlano = (plano) => {
        if (plano.id === planoAtual) {
            return; // Não faz nada se for o plano atual
        }
        setPlanoSelecionado(plano);
        setShowConfirmModal(true);
    };

    const processarMudancaPlano = async () => {
        try {
            const token = localStorage.getItem('token');
            // Aqui seria a chamada para alterar o plano
            // const response = await fetch('http://localhost:8000/prestador/plano', {
            //     method: 'PUT',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         plano: planoSelecionado.id
            //     })
            // });

            // Simulando sucesso
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
    };    return (
        <div className={styles.pageContainer}>
            <Header />
            
            <div className={styles.content}>
                {/* Navegação Secundária */}
                <SecondaryNavigation />
                
                <div className={styles.header}>
                    <h1>⭐ Planos de Assinatura</h1>
                    <p>Escolha o plano ideal para seu negócio e maximize suas oportunidades</p>
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
                                <li>• Todos os planos incluem acesso ao painel de controle básico</li>
                                <li>• Você pode alterar seu plano a qualquer momento</li>
                                <li>• Upgrades são aplicados imediatamente</li>
                                <li>• Downgrades são aplicados no próximo ciclo de cobrança</li>
                                <li>• Sem taxas de cancelamento ou multas</li>
                                <li>• Suporte técnico disponível para todos os planos</li>
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Modal de Confirmação */}
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

export default AssinaturaPrestador;
