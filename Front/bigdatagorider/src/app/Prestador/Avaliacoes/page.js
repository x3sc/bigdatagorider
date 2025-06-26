"use client";
import { useState, useEffect } from 'react';
import styles from './avaliacoes.module.css';

export default function AvaliacoesPrestador() {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock: Substitua pelo ID do prestador logado
    const id_prestador = 1;

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:5000/api/avaliacoes/prestador/${id_prestador}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setAvaliacoes([]);
                        return;
                    }
                    throw new Error('Falha ao buscar as avaliações.');
                }
                const data = await response.json();
                setAvaliacoes(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id_prestador) {
            fetchAvaliacoes();
        }
    }, [id_prestador]);

    const mediaGeral = avaliacoes.length > 0
        ? avaliacoes.reduce((acc, curr) => acc + curr.Nota, 0) / avaliacoes.length
        : 0;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Avaliações Recebidas</h1>
            
            <div className={styles.summary}>
                <h2>Sua Média Geral: {mediaGeral.toFixed(1)} ★</h2>
            </div>

            <div className={styles.avaliacoesList}>
                {loading && <p>Carregando avaliações...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    avaliacoes.length > 0 ? avaliacoes.map((avaliacao, index) => (
                        <div key={index} className={styles.avaliacaoCard}>
                            <h3>Avaliação de: {avaliacao.NomeAvaliador}</h3>
                            <div className={styles.ratingStatic}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: i < avaliacao.Nota ? '#f1c40f' : '#ccc' }}>★</span>
                                ))}
                            </div>
                            <p><em>{`"${avaliacao.Comentario}"`}</em></p>
                        </div>
                    )) : <p>Você ainda não recebeu nenhuma avaliação.</p>
                )}
            </div>
        </div>
    );
}
