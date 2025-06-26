'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './avaliar.module.css';

const Star = ({ filled, onClick }) => (
    <span className={styles.star} style={{ color: filled ? '#f1c40f' : '#ccc' }} onClick={onClick}>
        ★
    </span>
);

const Rating = ({ rating, onRate }) => (
    <div>
        {[...Array(5)].map((_, i) => (
            <Star key={i} filled={i < rating} onClick={() => onRate(i + 1)} />
        ))}
    </div>
);

export default function AvaliarServico() {
    const router = useRouter();
    const params = useParams();
    const { id } = params; // ID do serviço

    const [avaliacao, setAvaliacao] = useState({ comentario: '', nota: 0 });
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock: Obter ID do cliente e do prestador. Em um app real, viria do serviço.
    const id_cliente = 1; // Obter do localStorage ou context
    const id_prestador_avaliado = servico ? servico.id_prestador : null;

    useEffect(() => {
        if (!id) return;
        // Busca os detalhes do serviço para mostrar informações na tela
        const fetchServicoDetails = async () => {
            try {
                // Supondo que exista um endpoint para buscar um serviço específico
                const response = await fetch(`http://127.0.0.1:5000/api/servicos/${id}`);
                if (!response.ok) throw new Error('Falha ao buscar detalhes do serviço.');
                const data = await response.json();
                setServico(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicoDetails();
    }, [id]);

    const handleRate = (nota) => {
        setAvaliacao(prev => ({ ...prev, nota }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (avaliacao.nota === 0) {
            alert("Por favor, selecione uma nota de 1 a 5.");
            return;
        }
        if (!id_prestador_avaliado) {
            alert("Erro: ID do prestador não encontrado.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/avaliacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario_avaliador: id_cliente,
                    id_prestador_avaliado: id_prestador_avaliado,
                    id_servico: parseInt(id),
                    nota: avaliacao.nota,
                    comentario: avaliacao.comentario
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao enviar avaliação.');
            }

            alert('Avaliação enviada com sucesso!');
            router.push('/Cliente/Dashboard'); // Redireciona para o dashboard
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!servico) return <p>Serviço não encontrado.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Avaliar Serviço</h1>
            <div className={styles.servicoInfo}>
                <p><strong>Serviço:</strong> {servico.Nome}</p>
                {/* Idealmente, teríamos o nome do prestador aqui */}
                <p><strong>Prestador:</strong> ID {servico.id_prestador}</p> 
            </div>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.ratingInput}>
                    <p>Sua nota:</p>
                    <Rating rating={avaliacao.nota} onRate={handleRate} />
                </div>
                <textarea 
                    className={styles.textareaField}
                    placeholder="Deixe seu comentário sobre o serviço (opcional)..."
                    value={avaliacao.comentario}
                    onChange={(e) => setAvaliacao(prev => ({ ...prev, comentario: e.target.value }))}
                />
                <button type="submit" className={styles.submitButton}>Enviar Avaliação</button>
            </form>
        </div>
    );
}
