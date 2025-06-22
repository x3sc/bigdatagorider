'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import HeaderPrestador from '@/components/headerPrestador';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/react'; // Correção aqui
import Image from 'next/image';

export default function EditarPerfilPrestador() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState({
        ocupacao_cargo: false,
        sobre_mim: false,
        historico_profissional: false
    });

    // Mock: Substitua pelo ID do usuário logado
    const id_prestador = 1; // Você precisará obter isso do estado de autenticação

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/perfil-prestador/${id_prestador}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do perfil.');
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
    }, [id_prestador]);

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/perfil-prestador/${id_prestador}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ocupacao_cargo: userData.Ocupacao_Cargo,
                    sobre_mim: userData.Sobre_Mim,
                    historico_profissional: userData.Historico_Profissional
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar os dados.');
            }

            alert('Perfil atualizado com sucesso!');
            // Desativa todos os modos de edição
            setIsEditing({ ocupacao_cargo: false, sobre_mim: false, historico_profissional: false });

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const toggleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!userData) {
        return <div>Não foi possível carregar o perfil.</div>;
    }

    return (
        <main>
            <HeaderPrestador />
            <div className={styles.container}>
                <h1 className={styles.title}>Editar meu perfil</h1>

                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarContainer}>
                            <Image src="/assets/editar-perfil/foto.png" alt="Foto do Perfil" width={150} height={150} className={styles.avatar} />
                            <button className={styles.editIcon} style={{ top: '10px', right: '10px' }}><Image src="/assets/editar-perfil/pencil.svg" alt="Editar" width={20} height={20} /></button>
                        </div>
                        <div className={styles.profileInfo}>
                            <div className={styles.nameContainer}>
                                <h2>{userData.Nome} {userData.Sobrenome}</h2>
                            </div>
                            <div className={styles.rating}>
                                {'★'.repeat(Math.round(userData.Nota_Media))}{'☆'.repeat(5 - Math.round(userData.Nota_Media))}
                                <span> ({userData.Nota_Media.toFixed(2)})</span>
                            </div>
                            <div className={styles.occupationContainer}>
                                {isEditing.ocupacao_cargo ? (
                                    <Input
                                        value={userData.Ocupacao_Cargo || ''}
                                        onValueChange={(val) => handleInputChange('Ocupacao_Cargo', val)}
                                    />
                                ) : (
                                    <h3>{userData.Ocupacao_Cargo || 'Ocupação/cargo'}</h3>
                                )}
                                <button onClick={() => toggleEdit('ocupacao_cargo')} className={styles.editIcon}><Image src="/assets/editar-perfil/pencil.svg" alt="Editar" width={20} height={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.detailsCard}>
                    <div className={styles.cardHeader}>
                        <h4>Sobre mim</h4>
                        <button onClick={() => toggleEdit('sobre_mim')} className={styles.editIcon}><Image src="/assets/editar-perfil/pencil.svg" alt="Editar" width={20} height={20} /></button>
                    </div>
                    {isEditing.sobre_mim ? (
                        <Textarea
                            value={userData.Sobre_Mim || ''}
                            onValueChange={(val) => handleInputChange('Sobre_Mim', val)}
                            rows={5}
                        />
                    ) : (
                        <p>{userData.Sobre_Mim || 'Descreva-se brevemente.'}</p>
                    )}
                </div>

                <div className={styles.detailsCard}>
                    <div className={styles.cardHeader}>
                        <h4>Histórico Profissional</h4>
                        <button onClick={() => toggleEdit('historico_profissional')} className={styles.editIcon}><Image src="/assets/editar-perfil/pencil.svg" alt="Editar" width={20} height={20} /></button>
                    </div>
                    {isEditing.historico_profissional ? (
                        <Textarea
                            value={userData.Historico_Profissional || ''}
                            onValueChange={(val) => handleInputChange('Historico_Profissional', val)}
                            rows={8}
                        />
                    ) : (
                        <p>{userData.Historico_Profissional || 'Detalhe sua experiência profissional.'}</p>
                    )}
                </div>

                <div className={styles.actionButtons}>
                    <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            </div>
        </main>
    );
}
