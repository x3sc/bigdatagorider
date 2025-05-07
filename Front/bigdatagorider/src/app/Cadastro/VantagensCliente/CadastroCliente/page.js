"use client";
import React, { useState } from 'react';
import styles from './CdCliente.module.css';
import Header from '@/components/header';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export default function CadastroCliente() {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '',
    });

    const handleChange = (name, value) => {
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
                <div className={styles.contentWrapper}>
                    <div className={styles.left}>
                        <img
                            src="/assets/login/homem 1 (1).png"
                            alt="Descrição"
                            className={styles.leftImg}
                        />
                        <div className={styles.redArrows}>
                            {/* Adicione as setas vermelhas aqui, se necessário */}
                        </div>
                    </div>
                    <div className={styles.loginBox}>
                        <h2 className={styles.loginBoxTitle}>Criando sua conta</h2>
                        <Button className={styles.googleBtn} type="button">
                            <img
                                src="/assets/login/Logo-Google-G.png"
                                alt="Google"
                                className={styles.googleBtnImg}
                            />
                            Continue com o Google
                        </Button>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="email"
                                name="email"
                                label="E-mail"
                                placeholder="E-mail"
                                value={formData.email}
                                onValueChange={value => handleChange('email', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Input
                                type="password"
                                name="senha"
                                label="Senha"
                                placeholder="Senha"
                                value={formData.senha}
                                onValueChange={value => handleChange('senha', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Input
                                type="text"
                                name="nomeCompleto"
                                label="Nome completo"
                                placeholder="Nome completo"
                                value={formData.nomeCompleto}
                                onValueChange={value => handleChange('nomeCompleto', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Input
                                type="text"
                                name="cpf"
                                label="CPF"
                                placeholder="CPF"
                                value={formData.cpf}
                                onValueChange={value => handleChange('cpf', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Input
                                type="text"
                                name="telefone"
                                label="Número de telefone"
                                placeholder="Número de telefone"
                                value={formData.telefone}
                                onValueChange={value => handleChange('telefone', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Button type="submit" className={styles.loginBtn} fullWidth>
                                Entrar
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}