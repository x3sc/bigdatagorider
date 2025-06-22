"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './vantagens.module.css';
import Header from '@/components/header';
import { Button } from "@heroui/react";


export default function VantagensCliente() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push('/Cadastro/VantagensCliente/CadastroCliente');
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p>Bem-Vindo(a) à GoRide</p>
          <h1>O Seu Caminho<br />Começa Aqui!</h1>
          <p>Alugue ou compre o veículo ideal<br />para sua jornada.</p>
          <Button onClick={handleCadastro} color="danger">Criar cadastro</Button>
        </div>
        <Image src="/assets/home/banner-home 1.png" alt="Homem com chave do carro" width={600} height={400} />
      </div>

      <div className={styles.solution}>
        <Image src="/assets/cliente/homem-azul 1.png" alt="Homem azul" width={400} height={400} />
        <div className={styles.solutionText}>
          <h2>Encontre a Melhor Solução para Sua Mobilidade</h2>
          <p>Nossa plataforma intuitiva oferece uma experiência sem complicações, conectando você ao carro ideal com apenas alguns cliques.</p>
          <Button onClick={handleCadastro} color="danger">Comece Agora</Button>
        </div>
      </div>

      <div className={styles.howItWorks}>
        <h2>Como Funciona</h2>
        <Image src="/assets/cliente/como-funciona-cards 1.png" alt="Como funciona" width={800} height={300} className={styles.howItWorksImage} />
        <Button onClick={handleCadastro} color="danger">Alugar ou Comprar</Button>
      </div>

      <div className={styles.benefits}>
        <h2>Benefícios Exclusivos</h2>
        <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
                <Image src="/assets/home/computador.png" alt="Frota Moderna" width={80} height={80} />
                <h3>Frota Moderna</h3>
                <p>Veículos novos e revisados para sua segurança.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/home/presente.png" alt="Planos Flexíveis" width={80} height={80} />
                <h3>Planos Flexíveis</h3>
                <p>Aluguel de curto ou longo prazo, como preferir.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/home/escudo.png" alt="Segurança Garantida" width={80} height={80} />
                <h3>Segurança Garantida</h3>
                <p>Seguro completo e assistência 24/7.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/home/maos.png" alt="Sem Complicações" width={80} height={80} />
                <h3>Sem Complicações</h3>
                <p>Processo 100% online, rápido e fácil.</p>
            </div>
            <div className={styles.benefitCard}>
                <Image src="/assets/home/headset.png" alt="Na palma da Mão" width={80} height={80} />
                <h3>Na palma da Mão</h3>
                <p>Gerencie tudo pelo nosso app.</p>
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
