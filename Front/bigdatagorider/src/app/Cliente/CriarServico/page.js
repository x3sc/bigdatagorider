"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './criarServico.module.css';
import dashboardStyles from '../Dashboard/dashboard.module.css';
import Header from '@/components/header';

export default function CriarServico() {    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        origem: '',
        destino: '',
        valor: '',
        tipo_veiculo_requerido: 'Carro', // Valor padrão
        quantidade_veiculos: 1, // NOVO CAMPO
        data_servico: '' // Data do serviço
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Você precisa estar logado para criar um serviço.');
            router.push('/Login');
            return;
        }

        // Validação simples
        for (const key in formData) {
            if (formData[key] === '') {
                setError(`O campo ${key} é obrigatório.`);
                return;
            }
        }
          try {
            const response = await fetch('http://127.0.0.1:5000/api/servicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    valor: parseFloat(formData.valor) // Garante que o valor é um número
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao criar o serviço.');
            }

            const result = await response.json();
            setSuccess(result.message);
            
            // Limpa o formulário e redireciona após um curto período
            setTimeout(() => {                setFormData({
                    nome: '',
                    descricao: '',
                    origem: '',
                    destino: '',
                    valor: '',
                    tipo_veiculo_requerido: 'Carro',
                    quantidade_veiculos: 1
                });
                router.push('/Cliente/Dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };    const handleNavigateToCreateService = () => {
        // Já estamos na página de criar serviço, não faz nada
    };

    const handleNavigateToDashboard = () => {
        router.push('/Cliente/Dashboard');
    };

    return (
        <div className={dashboardStyles.pageContainer}>
            <Header />
            <main className={dashboardStyles.main}>
                <div className={dashboardStyles.mainTabs}>
                    <button
                        className={dashboardStyles.activeMainTab}
                        onClick={handleNavigateToCreateService}
                    >
                        Criar nova solicitação
                    </button>
                    <button 
                        onClick={handleNavigateToDashboard}
                    >
                        Meus Serviços
                    </button>
                    <button onClick={() => alert('Planos de assinatura em breve!')}>
                        Planos de assinatura
                    </button>
                </div>

                <div className={styles.container}>
                    <h1 className={styles.title}>Criar Nova Solicitação de Serviço</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nome">Nome do Serviço</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="origem">Origem</label>
                            <input
                                type="text"
                                id="origem"
                                name="origem"
                                value={formData.origem}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="destino">Destino</label>
                            <input
                                type="text"
                                id="destino"
                                name="destino"
                                value={formData.destino}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="valor">Valor Inicial (R$)</label>
                            <input
                                type="number"
                                id="valor"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="data_servico">Data do Serviço</label>
                            <input
                                type="date"
                                id="data_servico"
                                name="data_servico"
                                value={formData.data_servico}
                                onChange={handleChange}
                                required
                            />
                        </div>                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="tipo_veiculo_requerido">Tipo de Veículo</label>
                            <select
                                id="tipo_veiculo_requerido"
                                name="tipo_veiculo_requerido"
                                value={formData.tipo_veiculo_requerido}
                                onChange={handleChange}
                                required
                            >
                                <option value="Carro">Carro</option>
                                <option value="Moto">Moto</option>
                                <option value="Van">Van</option>
                                <option value="Caminhão">Caminhão</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="quantidade_veiculos">Quantidade de Veículos</label>
                            <input
                                type="number"
                                id="quantidade_veiculos"
                                name="quantidade_veiculos"
                                value={formData.quantidade_veiculos}
                                onChange={handleChange}
                                min="1"
                                max="20"
                                required
                            />
                        </div>
                    </div>{error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button type="submit" className={styles.submitButton}>Criar Serviço</button>
                </form>
                </div>
            </main>
        </div>
    );
}
