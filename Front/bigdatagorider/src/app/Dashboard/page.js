"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

const Dashboard = () => {
    const [userType, setUserType] = useState(null);
    const [servicos, setServicos] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/Login');
            return;
        }

        setUserType(storedUserType);

        if (storedUserType) {
            const fetchServicos = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/servicos', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setServicos(data);
                    } else {
                        console.error('Erro ao buscar serviços');
                    }
                } catch (error) {
                    console.error('Erro ao buscar serviços:', error);
                }
            };
            fetchServicos();
        }
    }, [router]);

    const handleCreateService = () => {
        router.push('/Cliente/CriarServico');
    };

    const renderPrestadorDashboard = () => (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2>Dashboard</h2>
                <nav>
                    <ul>
                        <li className={styles.active}>Meus Serviços</li>
                        <li>Minha Agenda</li>
                        <li>Meu Perfil</li>
                        <li>Minhas Avaliações</li>
                        <li>Sair</li>
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Meus Serviços</h1>
                    <div className={styles.tabs}>
                        <button className={styles.activeTab}>Todos</button>
                        <button>Ativos</button>
                        <button>Pendentes</button>
                        <button>Concluídos</button>
                        <button>Cancelados</button>
                    </div>
                </header>
                <div className={styles.serviceList}>
                    <table>
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.map(servico => (
                                <tr key={servico.id}>
                                    <td>{servico.nome}</td>
                                    <td>{servico.cliente_nome}</td>
                                    <td>{new Date(servico.data_servico).toLocaleDateString()}</td>
                                    <td><span className={`${styles.status} ${styles[servico.status.toLowerCase()]}`}>{servico.status}</span></td>
                                    <td>
                                        <button className={styles.actionButton}>Ver</button>
                                        <button className={styles.actionButton}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );

    const renderClienteDashboard = () => (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2>Dashboard</h2>
                <nav>
                    <ul>
                        <li className={styles.active} onClick={handleCreateService}>Criar Novo Serviço</li>
                        <li>Meus Pedidos</li>
                        <li>Meu Perfil</li>
                        <li>Sair</li>
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Bem-vindo, Cliente!</h1>
                </header>
                <div className={styles.serviceList}>
                    <p>Selecione uma opção no menu ao lado.</p>
                </div>
            </main>
        </div>
    );

    if (!userType) {
        return <div>Carregando...</div>;
    }

    return userType === 'prestador' ? renderPrestadorDashboard() : renderClienteDashboard();
};

export default Dashboard;
