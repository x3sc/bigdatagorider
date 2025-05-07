"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Header from "@/components/header";
import styles from './styles/Home.module.css';
import Footer from "@/components/footer";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Dados do FAQ
  const faqItems = [
    {
      pergunta: "Como posso me cadastrar na GoRide?",
      resposta: "Basta clicar no botão 'Cadastre-se' no menu superior e preencher o formulário com seus dados. O processo leva menos de 1 minuto!"
    },
    {
      pergunta: "Quais são as formas de pagamento aceitas?",
      resposta: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), débito, PIX e transferência bancária."
    },
    {
      pergunta: "A GoRide possui seguro para os veículos?",
      resposta: "Sim, todos nossos veículos possuem seguro completo incluído no valor do aluguel ou serviço."
    },
    {
      pergunta: "Como funciona o cancelamento de reservas?",
      resposta: "Você pode cancelar gratuitamente até 24 horas antes da reserva. Após esse período, pode haver cobrança de taxa conforme nossa política."
    }
  ];

  // Função para alternar as respostas
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (

    <main>
      <div>
        <Header />
      </div>
      <section className={styles.section}>
        <div className={styles.jornada}>
          <p>Bem-Vindo(a) à GoRide</p>
          <h1 className={styles.prioridade}>Sua Jornada,<br />nossa prioridade</h1>
          <p>Mobilidade sob medida, onde e quando <br />você precisar</p>
        </div>
        <div>
          <button className={styles.botao}>Quero Começar Agora</button>
        </div>
      </section>

      <div className={styles.mobilidade}>
        <div>
          <Image
            src="/assets/home/retangulo.png"
            className={styles.logo}
            width={1200}
            height={630}
            alt="Imagem de mobilidade"
          />
        </div>
        <div className={styles.aviaozao}>
          <h1>Encontre a Mobilidade<br />Perfeita para você</h1>
          <p>Na <strong>Go Ride</strong>, conectamos você às <strong>melhores soluções</strong>
            de<br /><strong>transporte</strong>, seja para alugar,comprar, ou contratar serviços<br />com segurança e
            praticidade</p>
          <div className={styles.aviaozinho}>
            <Image
              src="/assets/home/logo-aviao 1.png"
              className={styles.aviao}
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Viaje com liberdade</p>
          </div>
          <div className={styles.aviaozinho}>
            <Image
              src="/assets/home/logo-aviao 1.png"
              className={styles.aviao}
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Compre com Confiança</p>
          </div>
          <div className={styles.aviaozinho}>
            <Image
              src="/assets/home/logo-aviao 1.png"
              className={styles.aviao}
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Contrate serviços sob medida</p>
          </div>
          <div className={styles.experimente}>
            <strong>Experimente agora</strong>
            <button className={styles.botao}>Cadastre-se em 1 minuto</button>
          </div>
        </div>
      </div>

      <div className={styles.escolher}>
        <h1>Por que escolher a Go Ride ?</h1>
        <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>

      <div className={styles.container}>
        <div className={styles.bola}>
          <Image
            src="/assets/home/computador.png"
            className={styles.circulo}
            width={1200}
            height={630}
            alt="Ícone de computador"
          />
          <p><b>Processo <br />100% Online</b></p>
          <p>Veículos novos<br />e revisados regularmente</p>
        </div>
        <div className={styles.bola}>
          <Image
            src="/assets/home/Group 1171275239.png"
            className={styles.circulo}
            width={1200}
            height={630}
            alt="Ícone de ofertas"
          />
          <p><b>Ofertas <br /> exclusivas</b></p>
          <p>aluguel de curto ou longo<br />prazo, financiamento facilitado</p>
        </div>
        <div className={styles.bola}>
          <Image
            src="/assets/home/Group 1171275240.png"
            className={styles.circulo}
            width={1200}
            height={630}
            alt="Ícone de flexibilidade"
          />
          <p><b>Flexibilidade<br />total</b></p>
          <p>Seguro completo e assistência 24/7<br />para sua tranquilidade</p>
        </div>
        <div className={styles.bola}>
          <Image
            src="/assets/home/Group 1171275241.png"
            className={styles.circulo}
            width={1200}
            height={630}
            alt="Ícone de suporte"
          />
          <p><b>Suporte<br />dedicado</b></p>
          <p>Contratação digital com suporte especializado</p>
        </div>
      </div>

      <div className={styles.meio}>
        <h1>Como Funciona</h1>
      </div>

      <div className={styles.quadrado}>
        <div className={styles.square}>1 - Cadastre-se<br />Rápido,simples e gratuito.</div>
        <div className={styles.square}>2 - Escolha seu serviço<br />Aluguel, compra ou transporte.</div>
        <div className={styles.square}>3 - Aproveite!<br />Tudo resolvido em poucos cliques.</div>
      </div>

      <div className={styles.meio}>
        <h1>Depoimento de<br /> Quem Já Usa</h1>
        <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>

      <div className={styles.quadrado}>
        <div className={styles.square}></div>
        <div className={styles.square}></div>
        <div className={styles.square}></div>
      </div>

      <div className={styles.meio}>
        <button className={styles.botao}>Quero fazer parte também</button>
      </div>

      <div className={styles.pronto}>
        <div className={styles.comeco}>
          <h1>Pronto para Começar ?</h1>
          <p>Seja para alugar, comprar ou trabalhar conosco,<br /> sua jornada começa aqui!</p>
          <strong>Cadastre-se agora e ganhe benefício exclusivo</strong>
          <button className={styles.botao}>Vamos lá</button>
        </div>
        <div>
          <Image
            src="/assets/home/retangulo.png"
            className={styles.logo}
            width={1200}
            height={630}
            alt="Imagem decorativa"
          />
        </div>
      </div>

      {/* Seção FAQ Corrigida */}
      <div className={styles.antesdafaq}>
        <div>
          <div className={styles.retangulo}>
            <Image
              src="/assets/home/retangulo.png"
              className={styles.logo}
              width={1200}
              height={630}
              alt="Imagem decorativa"
            />
          </div>
          <div className={styles.faq}>
            <h1>FAQ</h1>
            {faqItems.map((item, index) => (
              <div className={styles.item} key={index}>
                <div
                  className={`${styles.pergunta} ${activeIndex === index ? styles.active : ""}`}
                  onClick={() => toggleAnswer(index)}
                >
                  <p>{item.pergunta}</p>
                  <span className="toggle-icon">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </div>
                <div
                  className={`${styles.resposta} ${activeIndex === index ? styles.show : ""}`}
                >
                  <p>{item.resposta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>


  );
}