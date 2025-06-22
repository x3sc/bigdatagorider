"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../avaliacao.module.css';
import dashboardStyles from '../../Cliente/Dashboard/dashboard.module.css';
import Header from '@/components/header';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/textarea';

const AvaliacaoPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id_servico } = params;

    const [nota, setNota] = useState(0);
    const [hoverNota, setHoverNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !id_servico) {
            router.push('/Login');
            return;
        }

        const fetchServicoDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/servicos/${id_servico}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar detalhes do serviço.');
                }
                const data = await response.json();
                setServico(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicoDetails();    }, [id_servico, router]);

    const handleNavigateToCreateService = () => {
        router.push('/Cliente/CriarServico');
    };

    const handleNavigateToDashboard = () => {
        router.push('/Cliente/Dashboard');
    };

    const handleAvaliar = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (nota === 0) {
            setSubmitError("Por favor, selecione uma nota.");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/avaliacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    servico_id: parseInt(id_servico, 10),
                    nota: nota,
                    comentario: comentario
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao enviar a avaliação.');
            }

            alert('Avaliação enviada com sucesso!');
            router.push('/Cliente/Dashboard');

        } catch (err) {
            setSubmitError(err.message);
        }
    };

    if (loading) {
        return <div className={styles.container}><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
    }    return (
        <div className={dashboardStyles.pageContainer}>
            <Header />
            <main className={dashboardStyles.main}>
                <div className={dashboardStyles.mainTabs}>
                    <button onClick={handleNavigateToCreateService}>
                        Criar nova solicitação
                    </button>
                    <button onClick={handleNavigateToDashboard}>
                        Meus Serviços
                    </button>
                    <button onClick={() => alert('Planos de assinatura em breve!')}>
                        Planos de assinatura
                    </button>
                </div>

                <div className={styles.container}>
                    <h1 className={styles.title}>Avaliar Serviço</h1>
                {servico && (
                    <div className={styles.serviceInfo}>
                        <p><strong>Serviço:</strong> {servico.nome}</p>
                        <p><strong>Prestador:</strong> {servico.prestador_nome}</p>
                        <p><strong>Data:</strong> {new Date(servico.data_servico).toLocaleDateString()}</p>
                    </div>
                )}

                <form onSubmit={handleAvaliar} className={styles.form}>
                    <div className={styles.ratingContainer}>
                        <label className={styles.label}>Sua Nota:</label>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`${styles.star} ${star <= (hoverNota || nota) ? styles.filled : ''}`}
                                    onClick={() => setNota(star)}
                                    onMouseEnter={() => setHoverNota(star)}
                                    onMouseLeave={() => setHoverNota(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.commentContainer}>
                        <label htmlFor="comentario" className={styles.label}>Seu Comentário (opcional):</label>
                        <Textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Deixe seu feedback sobre o serviço prestado..."
                            className={styles.textarea}
                        />
                    </div>

                    {submitError && <p className={styles.error}>{submitError}</p>}                    <Button type="submit" className={styles.submitButton}>
                        Enviar Avaliação
                    </Button>
                </form>
                </div>
            </main>
        </div>
    );
};

export default AvaliacaoPage;
