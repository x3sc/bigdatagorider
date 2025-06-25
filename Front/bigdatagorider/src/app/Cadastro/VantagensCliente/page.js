"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./vantagens.module.css";
import Header from "@/components/header";
import { Button } from "@heroui/react";

export default function VantagensCliente() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push("/Cadastro/VantagensCliente/CadastroCliente");
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p>Bem-Vindo(a) à GoRide</p>
          <h1>
            O Seu Caminho
            <br />
            Começa Aqui!
          </h1>
          <p>
            Alugue ou compre o veículo ideal
            <br />
            para sua jornada.
          </p>
          <Button onClick={handleCadastro} color="danger">
            Criar cadastro
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
          <h2>
            Encontre a Melhor Solução<br></br>para Sua Mobilidade
          </h2>
          <p>
            <span>
              Escolha entre alugar ou comprar um veículo com agilidade e
              segurança.<br></br>
              <br></br>
            </span>
            Nossa plataforma intuitiva oferece uma experiência sem<br></br>{" "}
            complicações, conectando você ao carro ideal com poucos cliques.
          </p>
          <Button onClick={handleCadastro} color="danger">
            Comece Agora
          </Button>
        </div>
      </div>

      <div className={styles.howItWorks}>
        <h2>Como Funciona</h2>
        <div className={styles.linha}></div>
        <Image
          src="/assets/cliente/como-funciona-cards 1.png"
          alt="Como funciona"
          width={1000}
          height={300}
          className={styles.howItWorksImage}
        />
        <Button onClick={handleCadastro} color="danger">
          Alugar ou Comprar
        </Button>
      </div>

      <div className={styles.benefits}>
        <h2>Benefícios Exclusivos</h2>
        <div className={styles.linha}></div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/cliente/icon1.png"
              className={styles.IconBeneficios}
              alt="Frota Moderna"
              width={80}
              height={80}
            />
            <h3>Frota Moderna</h3>
            <p>Veículos novos e revisados para sua segurança.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/cliente/icon2.png"
              className={styles.IconBeneficios}
              alt="Planos Flexíveis"
              width={80}
              height={80}
            />
            <h3>Planos Flexíveis</h3>
            <p>Aluguel de curto ou longo prazo, como preferir.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/cliente/icon3.png"
              className={styles.IconBeneficios}
              alt="Segurança Garantida"
              width={80}
              height={80}
            />
            <h3>Segurança Garantida</h3>
            <p>Seguro completo e assistência 24/7.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/cliente/icon4.png"
              className={styles.IconBeneficios}
              alt="Sem Complicações"
              width={80}
              height={80}
            />
            <h3>Sem Complicações</h3>
            <p>Processo 100% online, rápido e fácil.</p>
          </div>
          <div className={styles.benefitCard}>
            <Image
              src="/assets/cliente/icon5.png"
              className={styles.IconBeneficios}
              alt="Na palma da Mão"
              width={80}
              height={80}
            />
            <h3>Variedade de Modelos</h3>
            <p>
              Carros para todas as necessidades: compactos, SUVs, utilitários e
              de luxo.
            </p>
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
