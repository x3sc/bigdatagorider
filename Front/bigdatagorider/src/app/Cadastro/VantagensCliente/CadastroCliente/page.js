// front/bigdatagorider/src/app/Cadastro/VantagensCliente/CadastroCliente/page.js

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento
import styles from './CdCliente.module.css';
import Header from '@/components/header';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export default function CadastroCliente() {
    const router = useRouter(); // Instância do router para navegar entre páginas

    // Estado para os dados do formulário, com o campo de confirmação de senha
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '',
        confirmarSenha: '', // Campo adicionado para validação
    });

    // Estados para gerir o feedback visual durante a submissão
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Para exibir mensagens de erro no HTML se desejar

    // Função para atualizar o estado do formulário
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Função assíncrona para lidar com o envio do formulário para o backend
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página
        setError(null);

        // 1. Validação: Verifica se as senhas coincidem
        if (formData.senha !== formData.confirmarSenha) {
            const errorMessage = 'As senhas não coincidem. Por favor, tente novamente.';
            setError(errorMessage);
            window.alert(errorMessage); // Exibe o alerta para o utilizador
            return;
        }

        setLoading(true); // Ativa o estado de carregamento

        try {
            // 2. Envio dos Dados: Faz a chamada para a API
            const apiUrl = 'http://127.0.0.1:8000/api/cadastro-cliente';

            // Prepara o objeto de dados a ser enviado, removendo a confirmação da senha
            const dataToSend = { ...formData };
            delete dataToSend.confirmarSenha;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            // Se a resposta da API não for de sucesso, lança um erro
            if (!response.ok) {
                // Usa a mensagem de erro específica vinda do backend
                throw new Error(result.detail || 'Ocorreu um erro ao tentar o cadastro.');
            }

            // 3. Sucesso: Se tudo correu bem
            window.alert("Cadastro realizado com sucesso! Você será redirecionado para a página de login.");
            
            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                router.push('/Login');
            }, 2000);

        } catch (err) {
            // 4. Erro: Captura qualquer erro (de rede ou da API)
            setError(err.message);
            window.alert(`Erro: ${err.message}`); // Exibe a mensagem de erro no alerta
        } finally {
            // Garante que o estado de carregamento é desativado no final
            setLoading(false);
        }
    };

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.left}>
                        <img
                            src="/assets/login/homem 1 (1).png"
                            alt="Homem a mexer no telemóvel junto a um carro"
                            className={styles.leftImg}
                        />
                        <div className={styles.redArrows}>
                            {/* Pode adicionar as setas aqui se necessário */}
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
                                type="password"
                                name="confirmarSenha"
                                label="Confirmar Senha"
                                placeholder="Confirme sua Senha"
                                value={formData.confirmarSenha}
                                onValueChange={value => handleChange('confirmarSenha', value)}
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
                                type="tel"
                                name="telefone"
                                label="Número de telefone"
                                placeholder="Número de telefone"
                                value={formData.telefone}
                                onValueChange={value => handleChange('telefone', value)}
                                className={styles.loginInput}
                                required
                            />
                            <Button type="submit" className={styles.loginBtn} fullWidth disabled={loading}>
                                {loading ? 'Aguarde...' : 'Criar Conta'}
                            </Button>
                             {/* Opcional: exibe a mensagem de erro também na página */}
                            {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
