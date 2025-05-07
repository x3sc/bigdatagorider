"use client";
import React, { useState } from 'react';
import styles from './CdCliente.module.css';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function CadastroCliente() {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <main>
            <Header />
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src="/assets/login/homem 1 (1).png" alt="Descrição" />
                <div className={styles.redArrows}>
                    {/* Adicione as setas vermelhas aqui, se necessário */}
                </div>
            </div>
            <div className={styles.card}>
                <h2 className={styles.title}>Criando sua conta</h2>
                <button className={styles.googleButton}>
                    <img 
                        src="/assets/login/Logo-Google-G.png" 
                        alt="Google"
                        className={styles.googleIcon}
                    />
                    Continue com o Google
                </button>
                <p className={styles.orText}>ou</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nomeCompleto"
                        placeholder="Nome completo"
                        value={formData.nomeCompleto}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="cpf"
                        placeholder="Cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="telefone"
                        placeholder="Número de telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
        <Footer />
        </main>
    );
}

