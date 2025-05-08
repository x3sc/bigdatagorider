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
        <Header/>
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
              src="/assets/home/art1 1.png"
              className={styles.carro}
              width={400}
              height={400}
              alt="Rapaz no carro"
          />
        </div>
        <div className={styles.aviaozao}>
          <h1><b>Encontre a Mobilidade<br />Perfeita para você</b></h1>
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
              src="/assets/home/Vector.png"
              className={styles.aviao}
              width={1200}
              height={630}
              alt="Ícone de carrinho de compras"
            />
            <p>Compre com Confiança</p>
          </div>
          <div className={styles.aviaozinho}>
            <Image
              src="/assets/home/maos.png"
              className={styles.aviao}
              width={1200}
              height={630}
              alt="Ícone de aperto de mãos"
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
        <h1><b>Por que escolher a Go Ride ?</b></h1>
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
          <p>Contratação digital com <br />suporte especializado</p>
        </div>
      </div>

      <div className={styles.esquerda}>
        <h1><b>Como Funciona</b></h1>
      </div>
      <div className={styles.quadrado}>
        <div className={styles.square}> 
          <h1>1</h1>
          <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
          <h2>Cadastre-se</h2>
          <p>Rápido, simples e gratuito.</p>
        </div>
        <div className={styles.square}>
        <h1>2</h1>
          <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
        <h2>Escolha seu serviço</h2>
        <p>Aluguel, compra ou transporte.</p>
        </div>
        <div className={styles.square}>
        <h1>3</h1>
          <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
        <h2>Aproveite!</h2>
        <p>Tudo resolvido em poucos cliques.</p>
        </div>
      </div>

      <div className={styles.meio}>
        <h1><b>Depoimento de<br /> Quem Já Usa</b></h1>
        <Image
          src="/assets/home/Rectangle 1018.png"
          className={styles.rectangle}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>
      <div className={styles.quadrado}>
        <div className={styles.square}>
        <Image
          src="/assets/home/Rapaz.png"
          className={styles.usuario}
          width={1200}
          height={600}
          alt="Rapaz"
        />
        <h1>Carlos</h1>
        <p>"Comprei meu carro seminovo com segurança e ótimo preço. Recomendo!"</p>
        </div>
        <div className={styles.square}>
        <Image
          src="/assets/home/Mulher.png"
          className={styles.usuario}
          width={1200}
          height={600}
          alt="Mulher"
        />
        <h1>Ana</h1>
        <p>"Aluguei um carro para minha viagem e foi tão fácil que nunca mais usei outro app!"</p>
        </div>
        <div className={styles.square}>
        <Image
          src="/assets/home/Homem.png"
          className={styles.usuario}
          width={1200}
          height={600}
          alt="Homem"
        />
        <h1>Ricardo</h1>
        <p>"Como prestador de serviços, aumento minha renda com total flexibilidade"</p>
        </div>
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
            src="/assets/home/art2 1.png"
            className={styles.rapaznocarro}
            width={1200}
            height={630}
            alt="Imagem decorativa"
          />
        </div>
      </div>

      {/* Seção FAQ Corrigida */}
  
      <div className={styles.antesdafaq}>
  <div className={styles.fila}>
    <div className={styles.imagem}>
      <Image
        src="/assets/home/mulher-ajudal 1.png"
        className={styles.mulherajuda}
        width={1200}
        height={630}
        alt="Mulher GoRide"
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
          <div className={`${styles.resposta} ${activeIndex === index ? styles.show : ""}`}>
            <p>{item.resposta}</p>
          </div>
        </div>
       ))}
      </div>
    </div>
  </div>

    </main>
  );
}