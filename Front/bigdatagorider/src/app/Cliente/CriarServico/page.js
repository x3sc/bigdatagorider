"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    Card, 
    CardBody, 
    CardHeader, 
    Input,
    Textarea,
    Select,
    SelectItem,
    Spinner
} from '@heroui/react';
import Header from '@/components/header';
import SecondaryNavigation from '@/components/SecondaryNavigation';
import { TIPOS_VEICULO } from '@/constants/vehicleTypes';
import styles from '../Dashboard/dashboardCliente.module.css';

export default function CriarServico() {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        origem: '',
        destino: '',
        valor: '',
        tipo_veiculo_requerido: 'Carro',
        quantidade_veiculos: 1,
        data_servico: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

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
                setLoading(false);
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
                    valor: parseFloat(formData.valor)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao criar o serviço.');
            }

            const result = await response.json();
            setSuccess(result.message);
            
            // Limpa o formulário e redireciona após um curto período
            setTimeout(() => {
                setFormData({
                    nome: '',
                    descricao: '',
                    origem: '',
                    destino: '',
                    valor: '',
                    tipo_veiculo_requerido: 'Carro',
                    quantidade_veiculos: 1,
                    data_servico: ''
                });
                router.push('/Cliente/Dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <SecondaryNavigation 
                currentPage="Criar Novo Serviço"
                userType="cliente"
                userName="Cliente Demo"
            />
            
            <main className={styles.main}>
                {/* Card de Conteúdo Principal */}
                <Card className={styles.contentCard}>
                    <CardHeader className={styles.cardHeader}>
                        <h2>➕ Criar Novo Serviço</h2>
                        <p>Preencha os dados do seu serviço para receber propostas de prestadores</p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            {/* Nome do Serviço */}
                            <Input
                                type="text"
                                label="Nome do Serviço"
                                placeholder="Ex: Transporte de mudança"
                                value={formData.nome}
                                onValueChange={(value) => handleChange('nome', value)}
                                isRequired
                                color="danger"
                                variant="bordered"
                                className={styles.formInput}
                            />

                            {/* Descrição */}
                            <Textarea
                                label="Descrição"
                                placeholder="Descreva detalhadamente o serviço necessário..."
                                value={formData.descricao}
                                onValueChange={(value) => handleChange('descricao', value)}
                                isRequired
                                color="danger"
                                variant="bordered"
                                minRows={3}
                                className={styles.formInput}
                            />

                            {/* Origem e Destino */}
                            <div className={styles.formRow}>
                                <Input
                                    type="text"
                                    label="Origem"
                                    placeholder="Endereço de origem"
                                    value={formData.origem}
                                    onValueChange={(value) => handleChange('origem', value)}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    className={styles.formInput}
                                />
                                <Input
                                    type="text"
                                    label="Destino"
                                    placeholder="Endereço de destino"
                                    value={formData.destino}
                                    onValueChange={(value) => handleChange('destino', value)}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    className={styles.formInput}
                                />
                            </div>

                            {/* Valor e Data */}
                            <div className={styles.formRow}>
                                <Input
                                    type="number"
                                    label="Valor Inicial (R$)"
                                    placeholder="0.00"
                                    value={formData.valor}
                                    onValueChange={(value) => handleChange('valor', value)}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">R$</span>
                                        </div>
                                    }
                                    className={styles.formInput}
                                />
                                <Input
                                    type="date"
                                    label="Data do Serviço"
                                    value={formData.data_servico}
                                    onValueChange={(value) => handleChange('data_servico', value)}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    className={styles.formInput}
                                />
                            </div>

                            {/* Tipo de Veículo e Quantidade */}
                            <div className={styles.formRow}>
                                <Select
                                    label="Tipo de Veículo"
                                    placeholder="Selecione o tipo de veículo"
                                    selectedKeys={[formData.tipo_veiculo_requerido]}
                                    onSelectionChange={(keys) => handleChange('tipo_veiculo_requerido', Array.from(keys)[0])}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    className={styles.formInput}
                                >
                                    {TIPOS_VEICULO.map((tipo) => (
                                        <SelectItem key={tipo.key} value={tipo.key}>
                                            {tipo.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    type="number"
                                    label="Quantidade de Veículos"
                                    placeholder="1"
                                    value={formData.quantidade_veiculos}
                                    onValueChange={(value) => handleChange('quantidade_veiculos', parseInt(value) || 1)}
                                    isRequired
                                    color="danger"
                                    variant="bordered"
                                    min={1}
                                    max={20}
                                    className={styles.formInput}
                                />
                            </div>

                            {/* Mensagens de Error e Success */}
                            {error && (
                                <div className={styles.errorMessage}>
                                    <p>❌ {error}</p>
                                </div>
                            )}
                            {success && (
                                <div className={styles.successMessage}>
                                    <p>✅ {success}</p>
                                </div>
                            )}

                            {/* Botão de Submit */}
                            <Button 
                                type="submit"
                                color="danger"
                                size="lg"
                                isLoading={loading}
                                disabled={loading}
                                className={styles.submitButton}
                                fullWidth
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        Criando Serviço...
                                    </>
                                ) : (
                                    '➕ Criar Serviço'
                                )}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
