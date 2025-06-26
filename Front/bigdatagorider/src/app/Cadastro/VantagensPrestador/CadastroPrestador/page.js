"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../Login/login.module.css';
import Header from '@/components/header';
import { Input, Button, Card, CardBody, Divider, Checkbox } from '@heroui/react';
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
    };    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.leftSection}>
                        <Image
                            src="/assets/prestador/banner1.png"
                            alt="Prestador de serviço"
                            width={500}
                            height={400}
                            className={styles.heroImage}
                        />
                    </div>

                    <div className={styles.rightSection}>
                        <Card className={styles.loginCard}>
                            <CardBody className={styles.cardBody}>
                                <div className={styles.logoSection}>
                                    <Image
                                        src="/assets/login/LOGO 1.png"
                                        alt="GoRider Logo"
                                        width={120}
                                        height={60}
                                        className={styles.logo}
                                    />
                                </div>

                                <h1 className={styles.title}>Crie sua Conta de Parceiro</h1>

                                <p className={styles.signupText}>
                                    Já tem uma conta?{' '}
                                    <Button
                                        as="a"
                                        href="/Login"
                                        variant="light"
                                        size="sm"
                                        className={styles.signupLink}
                                    >
                                        Faça login
                                    </Button>
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="text"
                                            label="Nome"
                                            placeholder="Digite seu nome"
                                            value={formData.nome}
                                            onValueChange={(val) => handleChange("nome", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="text"
                                            label="Sobrenome"
                                            placeholder="Digite seu sobrenome"
                                            value={formData.sobrenome}
                                            onValueChange={(val) => handleChange("sobrenome", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="email"
                                            label="E-mail"
                                            placeholder="Digite seu e-mail"
                                            value={formData.email}
                                            onValueChange={(val) => handleChange("email", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="text"
                                            label="CPF ou CNPJ"
                                            placeholder="Digite seu documento"
                                            value={formData.documento}
                                            onValueChange={(val) => handleChange("documento", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="tel"
                                            label="Telefone"
                                            placeholder="Digite seu telefone"
                                            value={formData.telefone}
                                            onValueChange={(val) => handleChange("telefone", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="date"
                                            label="Data de Nascimento"
                                            value={formData.data_nascimento}
                                            onValueChange={(val) => handleChange("data_nascimento", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="password"
                                            label="Senha"
                                            placeholder="Digite sua senha"
                                            value={formData.senha}
                                            onValueChange={(val) => handleChange("senha", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Input
                                            type="password"
                                            label="Confirmar Senha"
                                            placeholder="Digite sua senha novamente"
                                            value={formData.confirmarSenha}
                                            onValueChange={(val) => handleChange("confirmarSenha", val)}
                                            variant="bordered"
                                            size="lg"
                                            required
                                            classNames={{
                                                input: styles.input,
                                                inputWrapper: styles.inputWrapper
                                            }}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <Checkbox
                                            isSelected={agreedToTerms}
                                            onValueChange={setAgreedToTerms}
                                            color="danger"
                                        >
                                            Eu li e concordo com os{' '}
                                            <Button
                                                as="a"
                                                href="/termos"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="light"
                                                size="sm"
                                                className={styles.signupLink}
                                            >
                                                Termos de Uso
                                            </Button>
                                        </Checkbox>
                                    </div>

                                    <Button
                                        type="submit"
                                        color="danger"
                                        size="lg"
                                        className={styles.loginButton}
                                        isLoading={loading}
                                        isDisabled={!agreedToTerms}
                                        fullWidth
                                    >
                                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                                    </Button>
                                </form>

                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
