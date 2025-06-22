"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../VantagensCliente/vantagens.module.css'; // Reutilizando o mesmo CSS
import Header from '@/components/header';
import { Button } from "@heroui/react";


export default function VantagensPrestador() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push('/Cadastro/VantagensPrestador/CadastroPrestador');
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p>Bem-Vindo(a) à GoRide</p>
          <h1>Conecte-se a Novas<br />Oportunidades</h1>
          <p>Trabalhe conosco e aumente suas<br />oportunidades. Torne-se um prestador<br/>de serviços agora mesmo!</p>
          <Button onClick={handleCadastro} color="danger">Cadastre-se</Button>
        </div>
        <Image src="/assets/prestador/banner1.png" alt="Mulher no carro" width={600} height={400} />
      </div>

      <div className={styles.solution}>
        <Image src="/assets/cliente/homem-azul 1.png" alt="Homem azul" width={400} height={400} />
        <div className={styles.solutionText}>
          <h2>Transforme Seu Trabalho em Oportunidade!</h2>
          <p>Junte-se à nossa plataforma e ofereça seus serviços de transporte para milhares de clientes.</p>
          <Button onClick={handleCadastro} color="danger">Quero me cadastrar</Button>
        </div>
      </div>

      <div className={styles.howItWorks}>
        <h2>Como Funciona</h2>
        <Image src="/assets/prestador/como-funciona-prestador.png" alt="Como funciona" width={800} height={300} className={styles.howItWorksImage} />
        <Button onClick={handleCadastro} color="danger">Cadastre-se agora</Button>
      </div>

      <div className={styles.benefits}>
        <h2>Benefícios Exclusivos</h2>
        <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
                <Image src="/assets/prestador/beneficios/flexibilidade.png" alt="Flexibilidade Total" width={80} height={80} />
                <h3>Flexibilidade Total</h3>
                <p>Trabalhe quando e onde quiser.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/prestador/beneficios/pagamento.png" alt="Pagamento Seguro" width={80} height={80} />
                <h3>Pagamento Seguro</h3>
                <p>Receba seus pagamentos com segurança.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/prestador/beneficios/suporte.png" alt="Suporte Contínuo" width={80} height={80} />
                <h3>Suporte Contínuo</h3>
                <p>Nossa equipe está sempre a postos para ajudar.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/prestador/beneficios/demanda.png" alt="Alta Demanda" width={80} height={80} />
                <h3>Alta Demanda</h3>
                <p>Acesse uma base de clientes em crescimento.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/prestador/beneficios/taxa.png" alt="Baixa Taxa de Comissão" width={80} height={80} />
                <h3>Baixa Taxa de Comissão</h3>
                <p>Maximize seus lucros com nossas taxas.</p>
            </div>
        </div>
      </div>

      <div className={styles.testimonials}>
        <h2>Depoimentos</h2>
        <Image src="/assets/cliente/depoimentos.png" alt="Depoimentos" width={1000} height={400} />
      </div>

      <div className={styles.support}>
        <div className={styles.supportText}>
          <h2>Precisa de ajuda?</h2>
          <p>Estamos aqui para você 24/7, prontos para oferecer suporte e tirar dúvidas. Nossa equipe está à disposição para garantir que sua experiência seja a melhor possível.</p>
          <Button color="danger">Fale Conosco</Button>
        </div>
        <Image src="/assets/home/mulher-ajudal 1.png" alt="Suporte" width={400} height={400} />
      </div>
    </main>
  );
}