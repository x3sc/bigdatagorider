"use client";
import { useState, useEffect } from 'react';
import styles from './avaliacoes.module.css';

const Star = ({ filled, onClick }) => (
    <span className={styles.star} style={{ color: filled ? '#f1c40f' : '#ccc' }} onClick={onClick}>
        ★
    </span>
);

const Rating = ({ rating, onRate }) => {
    return (
        <div>
            {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < rating} onClick={() => onRate(i + 1)} />
            ))}
        </div>
    );
};

export default function AvaliacoesCliente() {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [novaAvaliacao, setNovaAvaliacao] = useState({ comentario: '', nota: 0, id_prestador_avaliado: 1, id_servico: 101 }); // Mock IDs
    const [loading, setLoading] = useState(true);

    // Mock: Substitua pelo ID do usuário logado
    const id_cliente = 1; 

    const fetchAvaliacoes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:5000/api/avaliacoes/cliente/${id_cliente}`);
            if (!response.ok) {
                // Se o cliente não tiver avaliações, a API retorna 404, o que é esperado.
                if (response.status === 404) {
                    setAvaliacoes([]);
                    return;
                }
                throw new Error('Falha ao buscar avaliações.');
            }
            const data = await response.json();
            setAvaliacoes(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvaliacoes();
    }, [id_cliente]);

    const mediaGeral = avaliacoes.length > 0 
        ? avaliacoes.reduce((acc, curr) => acc + curr.Nota, 0) / avaliacoes.length
        : 0;

    const handleRate = (nota) => {
        setNovaAvaliacao(prev => ({ ...prev, nota }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (novaAvaliacao.nota === 0) {
            alert("Por favor, selecione uma nota.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/avaliacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...novaAvaliacao, id_usuario_avaliador: id_cliente })
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar avaliação.');
            }

            alert('Avaliação enviada com sucesso!');
            setNovaAvaliacao({ comentario: '', nota: 0, id_prestador_avaliado: 1, id_servico: 101 }); // Reset form
            fetchAvaliacoes(); // Recarrega a lista de avaliações
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Minhas Avaliações</h1>
            
            <div className={styles.summary}>
                <h2>Média Geral das Avaliações: {mediaGeral.toFixed(1)} ★</h2>
            </div>

            <div className={styles.avaliacoesList}>
                {loading ? <p>Carregando avaliações...</p> :
                 avaliacoes.length > 0 ? avaliacoes.map(avaliacao => (
                    <div key={avaliacao.ID_Avaliacao} className={styles.avaliacaoCard}>
                        <h3>Serviço com {avaliacao.NomePrestador} {avaliacao.SobrenomePrestador}</h3>
                        <div className={styles.ratingStatic}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < avaliacao.Nota ? '#f1c40f' : '#ccc' }}>★</span>
                            ))}
                        </div>
                        <p>{`"${avaliacao.Comentario}"`}</p>
                    </div>
                )) : <p>Você ainda não fez nenhuma avaliação.</p>}
            </div>

            <div className={styles.formContainer}>
                <h2>Avaliar um Serviço</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campos para selecionar prestador e serviço seriam necessários aqui em um app real */}
                    <textarea 
                        className={styles.textareaField}
                        placeholder="Deixe seu comentário..."
                        value={novaAvaliacao.comentario}
                        onChange={(e) => setNovaAvaliacao(prev => ({ ...prev, comentario: e.target.value }))}
                        required
                    />
                    <div className={styles.ratingInput}>
                        <p>Sua nota:</p>
                        <Rating rating={novaAvaliacao.nota} onRate={handleRate} />
                    </div>
                    <button type="submit" className={styles.submitButton}>Enviar Avaliação</button>
                </form>
            </div>
        </div>
    );
}
