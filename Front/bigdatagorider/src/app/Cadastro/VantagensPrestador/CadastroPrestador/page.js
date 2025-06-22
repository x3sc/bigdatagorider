"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../Login/login.module.css'; // Usando o CSS do Login
import Header from '@/components/header';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import Image from 'next/image';

export default function CadastroPrestador() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        documento: '',
        telefone: '',
        data_nascimento: '', // Adicionado para consistência
        senha: '',
        confirmarSenha: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.senha !== formData.confirmarSenha) {
            const errorMessage = 'As senhas não coincidem.';
            window.alert(errorMessage);
            return;
        }

        if (!agreedToTerms) {
            const errorMessage = 'Você precisa aceitar os Termos de Uso.';
            window.alert(errorMessage);
            return;
        }

        setLoading(true);

        try {
            const apiUrl = 'http://127.0.0.1:5000/api/cadastro'; // Endpoint unificado
            const { confirmarSenha, ...data } = formData;
            const dataToSend = { ...data, tipo: 1 }; // 1 para prestador

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'Ocorreu um erro no cadastro.');
            }

            window.alert("Cadastro de parceiro realizado com sucesso! Redirecionando para o login.");
            setTimeout(() => router.push('/Login'), 2000);

        } catch (err) {
            setError(err.message);
            window.alert(`Erro: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/assets/prestador/banner1.png" // Imagem específica do prestador
                            alt="Prestador de serviço"
                            className={styles.leftImg}
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                    <div className={styles.loginBox}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <h2 className={styles.loginBoxTitle}>Crie sua Conta de Parceiro</h2>
                            <p className={styles.formSubtitle}>
                                Já tem uma conta? <a href="/Login" className={styles.loginLink}>Faça login</a>
                            </p>

                            <div className={styles.inputGroup}>
                                <Input placeholder="Nome" name="nome" value={formData.nome} onValueChange={(val) => handleChange("nome", val)} required />
                                <Input placeholder="Sobrenome" name="sobrenome" value={formData.sobrenome} onValueChange={(val) => handleChange("sobrenome", val)} required />
                            </div>

                            <Input placeholder="E-mail" type="email" name="email" value={formData.email} onValueChange={(val) => handleChange("email", val)} required className={styles.inputField} />
                            <Input placeholder="CPF ou CNPJ" name="documento" value={formData.documento} onValueChange={(val) => handleChange("documento", val)} required className={styles.inputField} />
                            <Input placeholder="Telefone" name="telefone" value={formData.telefone} onValueChange={(val) => handleChange("telefone", val)} required className={styles.inputField} />
                            <Input placeholder="Data de Nascimento" type="date" name="data_nascimento" value={formData.data_nascimento} onValueChange={(val) => handleChange("data_nascimento", val)} required className={styles.inputField} />
                            <Input placeholder="Senha" type="password" name="senha" value={formData.senha} onValueChange={(val) => handleChange("senha", val)} required className={styles.inputField} />
                            <Input placeholder="Confirmar Senha" type="password" name="confirmarSenha" value={formData.confirmarSenha} onValueChange={(val) => handleChange("confirmarSenha", val)} required className={styles.inputField} />

                            <div className={styles.termsContainer}>
                                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                                <label htmlFor="terms">
                                    Eu li e concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" className={styles.loginLink}>Termos de Uso</a>
                                </label>
                            </div>

                            <Button type="submit" className={styles.loginBtn} disabled={loading || !agreedToTerms}>
                                {loading ? 'Aguarde...' : 'Cadastrar'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
