"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../VantagensPrestador/vantagensPrestador.module.css";
import Header from "@/components/header";
import { Button } from "@heroui/react";

export default function VantagensPrestador() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push("/Cadastro/VantagensPrestador/CadastroPrestador");
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p>Bem-Vindo(a) à GoRide</p>
          <h1>
            Conecte-se a Novas
            <br />
            Oportunidades
          </h1>
          <p>
            Trabalhe conosco e aumente suas oportunidades. <br />
            Torne-se um prestador de serviços agora mesmo!
          </p>
          <Button onClick={handleCadastro} color="danger">
            Cadastre-se
          </Button>
        </div>
      </div>

      <div className={styles.solution}>
        <Image
          src="/assets/cliente/homem-azul 1.png"
          alt="Homem azul"
          width={700}
          height={400}
        />
        <div className={styles.solutionText}>
          <h2>Transforme Seu Trabalho em Oportunidade!</h2>
          <span>
            Junte-se à nossa plataforma e ofereça seus serviços de transporte
            <br></br>
            para milhares de clientes.
          </span>
          <p>
            Com um sistema flexível e seguro, você tem autonomia para definir
            <br></br>
            sua disponibilidade e garantir sua renda.
          </p>
          <Button onClick={handleCadastro} color="danger">
            Quero me cadastrar
          </Button>
        </div>
      </div>

      <div className={styles.howItWorks}>
        <h2>Como Funciona</h2>
        <div className={styles.linha}></div>
        <Image
          src="/assets/prestador/como-funciona-cards2.png"
          alt="Como funciona"
          width={1000}
          height={300}
          className={styles.howItWorksImage}
        />
        <Button onClick={handleCadastro} color="danger">
          Cadastre-se agora
        </Button>
      </div>

      <div className={styles.benefits}>
        <h2>Benefícios Exclusivos</h2>
        <div className={styles.linha}></div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/prestador/icon1.png"
              className={styles.IconBeneficios}
              alt="Flexibilidade Total"
              width={80}
              height={80}
            />
            <h3>Flexibilidade Total</h3>
            <p>
              Defina seus horários e escolha<br></br>quando trabalhar.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/prestador/icon2.png"
              className={styles.IconBeneficios}
              alt="Pagamento Seguro"
              width={80}
              height={80}
            />
            <h3>Pagamento Seguro</h3>
            <p>Receba seus pagamentos com segurança.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/prestador/icon3.png"
              className={styles.IconBeneficios}
              alt="Suporte Contínuo"
              width={80}
              height={80}
            />
            <h3>Suporte Contínuo</h3>
            <p>Nossa equipe está sempre a postos para ajudar.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/prestador/icon4.png"
              className={styles.IconBeneficios}
              alt="Alta Demanda"
              width={80}
              height={80}
            />
            <h3>Alta Demanda</h3>
            <p>Acesse uma base de clientes em crescimento.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/prestador/icon5.png"
              className={styles.IconBeneficios}
              alt="Baixa Taxa de Comissão"
              width={80}
              height={80}
            />
            <h3>Taxa reduzida</h3>
            <p>Maximize seus lucros com nossas taxas.</p>
          </div>
        </div>
      </div>

      <div className={styles.testimonials}>
        <h2>Depoimentos</h2>
        <div className={styles.linha}></div>
        <Image
          src="/assets/cliente/depoimentos.png"
          className={styles.cardDepoimentos}
          alt="Depoimentos"
          width={1000}
          height={400}
        />
      </div>

      <div className={styles.support}>
        <div className={styles.supportText}>
          <h2>Suporte e atendimento</h2>
          <h4>Precisa de ajuda?</h4>
          <p>
            Estamos aqui para você 24/7, prontos para oferecer suporte ágil e
            eficiente. Nossa equipe está disponível a qualquer momento para
            esclarecer dúvidas, auxiliar no processo de aluguel ou compra e
            garantir que sua experiência seja a melhor possível
          </p>
          <Button color="danger">Fale Conosco</Button>
        </div>
        <Image
          src="/assets/home/mulher-ajudal 1.png"
          alt="Suporte"
          width={700}
          height={400}
        />
      </div>
    </main>
  );
}
