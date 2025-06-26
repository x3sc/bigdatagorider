"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import Header from '@/components/header';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/react';
import Image from 'next/image';

export default function PerfilCliente() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userType = localStorage.getItem('userType');

            if (!token || userType !== 'cliente') {
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
                const clienteId = currentUser.id;

                // Agora buscar o perfil completo
                const response = await fetch(`http://127.0.0.1:5000/api/perfil-cliente/${clienteId}`, {
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
                console.error(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Obter o ID do usuário atual
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
            const clienteId = currentUser.id;

            const response = await fetch(`http://127.0.0.1:5000/api/perfil-cliente/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Erro ao atualizar perfil: ${errorData}`);
            }

            console.log("Perfil atualizado com sucesso!");
            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    };

    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!userData) {
        return <div>Não foi possível carregar o perfil.</div>;
    }

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Meu Perfil</h1>

                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarContainer}>
                            <Image src={userData.fotoUrl || "/assets/editar-perfil/foto.png"} alt="Foto do Perfil" width={150} height={150} className={styles.avatar} />
                        </div>
                        <div className={styles.profileInfo}>
                            <h2>{userData.nome}</h2>
                            <p>Cliente</p> 
                        </div>
                    </div>

                    <div className={styles.profileSection}>
                        <h3>Informações de Contato</h3>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Telefone:</strong> {userData.telefone}</p>
                    </div>

                    <div className={styles.profileSection}>
                        <h3>Minhas Avaliações Feitas</h3>
                        {userData.avaliacoes && userData.avaliacoes.length > 0 ? (
                            <ul className={styles.reviewList}>
                                {userData.avaliacoes.map((avaliacao, index) => (
                                    <li key={index} className={styles.reviewItem}>
                                        <p><strong>Prestador:</strong> {avaliacao.nome_prestador}</p>
                                        <p><strong>Nota:</strong> {'★'.repeat(avaliacao.estrelas)}{'☆'.repeat(5 - avaliacao.estrelas)}</p>
                                        <p><strong>Comentário:</strong> {avaliacao.comentario}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Você ainda não fez nenhuma avaliação.</p>
                        )}
                    </div>

                    {/* Botões de ação podem ser adicionados aqui se necessário */}
                </div>
            </div>
        </main>
    );
}
