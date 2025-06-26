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

    // Mock: Substitua pelo ID do usuário logado
    const id_cliente = 1; // Você precisará obter isso do estado de autenticação

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id_cliente) return;
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/perfil-cliente/${id_cliente}`);
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
    }, [id_cliente]);

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // A lógica de salvar será implementada aqui
        console.log("Salvando dados:", userData);
        setIsEditing(false);
        alert('Perfil atualizado com sucesso! (Simulado)');
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
