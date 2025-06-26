'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import Header from '@/components/header';
import Image from 'next/image';

export default function PerfilPrestador() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userType = localStorage.getItem('userType');

            if (!token || userType !== 'prestador') {
                router.push('/Login');
                return;
            }

            try {
                // Primeiro obter o ID do usuário atual
                const userResponse = await fetch('http://127.0.0.1:5000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!userResponse.ok) {
                    throw new Error('Falha ao obter dados do usuário');
                }

                const currentUser = await userResponse.json();
                const prestadorId = currentUser.id;

                // Agora buscar o perfil completo
                const response = await fetch(`http://127.0.0.1:5000/api/perfil-prestador/${prestadorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Falha ao buscar dados do perfil.');
                }
                
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Erro ao buscar dados do prestador:', error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!userData) {
        return <div>Não foi possível carregar o perfil.</div>;
    }

    // Função para calcular a média das estrelas
    const calcularMediaAvaliacoes = () => {
        if (!userData.avaliacoes || userData.avaliacoes.length === 0) {
            return 0;
        }
        const totalEstrelas = userData.avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.estrelas, 0);
        return (totalEstrelas / userData.avaliacoes.length).toFixed(1);
    };

    const mediaEstrelas = calcularMediaAvaliacoes();

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Meu Perfil de Prestador</h1>

                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarContainer}>
                            <Image src={userData.fotoUrl || "/assets/editar-perfil/foto.png"} alt="Foto do Perfil" width={150} height={150} className={styles.avatar} />
                        </div>
                        <div className={styles.profileInfo}>
                            <h2>{userData.nome}</h2>
                            <p>Prestador de Serviço</p>
                            <div className={styles.rating}>
                                <span>{mediaEstrelas}</span> {'★'.repeat(Math.round(mediaEstrelas))}{'☆'.repeat(5 - Math.round(mediaEstrelas))}
                                <span>({userData.avaliacoes.length} avaliações)</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.profileSection}>
                        <h3>Informações de Contato</h3>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Telefone:</strong> {userData.telefone}</p>
                    </div>

                    <div className={styles.profileSection}>
                        <h3>Avaliações Recebidas</h3>
                        {userData.avaliacoes && userData.avaliacoes.length > 0 ? (
                            <ul className={styles.reviewList}>
                                {userData.avaliacoes.map((avaliacao, index) => (
                                    <li key={index} className={styles.reviewItem}>
                                        <p><strong>Cliente:</strong> {avaliacao.nome_cliente}</p>
                                        <p><strong>Nota:</strong> {'★'.repeat(avaliacao.estrelas)}{'☆'.repeat(5 - avaliacao.estrelas)}</p>
                                        <p><strong>Comentário:</strong> {avaliacao.comentario}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Você ainda não recebeu nenhuma avaliação.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
