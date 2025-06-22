"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './procurarServicos.module.css';

const ProcurarServicos = () => {
    const [servicos, setServicos] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }

        const fetchServicos = async () => {
            try {
                // Endpoint para buscar serviços pendentes
                const response = await fetch('http://127.0.0.1:5000/api/servicos/pendentes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setServicos(data);
                } else {
                    setError('Erro ao buscar serviços pendentes.');
                }
            } catch (err) {
                setError('Erro de conexão com o servidor.');
            }
        };

        fetchServicos();
    }, [router]);

    const handleAceitar = async (servicoId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/servicos/${servicoId}/aceitar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Serviço aceito com sucesso!');
                // Atualiza a lista de serviços para remover o que foi aceito
                setServicos(servicos.filter(s => s.id !== servicoId));
            } else {
                const data = await response.json();
                alert(data.detail || 'Erro ao aceitar o serviço.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Procurar Serviços Pendentes</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.servicosGrid}>
                {servicos.length > 0 ? (
                    servicos.map(servico => (
                        <div key={servico.id} className={styles.servicoCard}>
                            <h3>{servico.nome}</h3>
                            <p>{servico.descricao}</p>
                            <p><strong>Cliente:</strong> {servico.cliente_nome}</p>
                            <p><strong>Data:</strong> {new Date(servico.data_criacao).toLocaleDateString()}</p>
                            <button onClick={() => handleAceitar(servico.id)}>Aceitar Serviço</button>
                        </div>
                    ))
                ) : (
                    <p>Nenhum serviço pendente encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProcurarServicos;
