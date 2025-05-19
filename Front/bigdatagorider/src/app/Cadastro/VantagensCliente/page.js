"use client";

import React, { useState } from "react";
import Image from 'next/image';
import styles from '../../styles/Cliente.module.css';
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function VantagensCliente() {

return(
<main>
      <div>
        <Header />
      </div>
        <div className={styles.container}>
          <p>Bem-Vindo(a)</p>
          <h1>O Seu Caminho <br /> Começa Aqui!</h1>
          <h2>Alugue ou compre o veículo ideal <br /> para sua jornada</h2>
           <button className={styles.botao}>Cadastrar-se</button>
        </div>
    <div className={styles.encontre}>
        <div>
          <Image
              src="/assets/cliente/homem-azul 1.png"
              className={styles.homemazul}
              width={400}
              height={400}
              alt="Rapaz azul"
        />
        </div>
      <div className={styles.escolha}>
        <h1> <b>Encontre a Melhor Solução <br /> para sua Mobilidade</b></h1>
        <p><b>Escolha entre alugar ou comprar um veículo com agilidade <br /> e segurança.</b></p>
        <p>Nossa plataforma intuitiva oferece uma experiência sem <br />complicações, conectando você ao carro ideal com poucos <br /> cliques.</p>
        <button className={styles.botao}>Comece Agora</button>
      </div>
    </div>
  <div className={styles.funciona}>
     <div>
        <h1><b>Como Funciona</b></h1>
      </div>
      <div>
        <Image
          src="/assets/cliente/rectangle.png"
          className={styles.retangulo}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>
      <div>
        <img src="/assets/cliente/como-funciona-cards 1.png"
        className={styles.cards}
        width={1200}
        height={600}
        alt="Etapas para usar a GoRide"
        />      
      </div>
      <div className={styles.texto}>
        <button className={styles.botao}>Alugar ou Comprar</button>
      </div>
    </div>
  <div>
      <div className={styles.exclusivos}>
        <h1><b>Benefícios exclusivos</b></h1>
          <Image
          src="/assets/cliente/rectangle.png"
          className={styles.retangulo}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
          />
      </div>

<div className={styles.lista}>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Frota Moderna</strong><br />Veículos novos e revisados regularmente.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Planos flexíveis</strong><br />Aluguel de curto ou longo prazo, financiamento facilitado.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Segurança garantida</strong><br />Seguro completo e assistência 24/7 para sua tranquilidade.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Sem Complicações</strong><br />Contratação digital com suporte especializado.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Variedade de Modelos</strong><br />Carros compactos, SUVs, utilitários e de luxo para atender a todas as necessidades.</p>
  </div>
</div>

  </div>
      <div className={styles.depoimentos}>
        <h1><b>Depoimentos</b></h1>
        <Image
          src="/assets/cliente/rectangle.png"
          className={styles.retangulo}
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>   
      <div>
        <img src="/assets/cliente/depoimentos.png"
        className={styles.avaliacao}
        width={1200}
        height={630}
        alt="Depoimentos"
        />
      </div>

      <div className={styles.suporte}>
        <div>
          <h1><b>Suporte e Atendimento</b></h1>
          <p><b>precisa de ajuda ?</b></p>
          <p>Estamos aqui para você 24/7, prontos para oferecer suporte <br /> ágil e eficiente. Nossa equipe está disponível a qualquer <br /> momento para esclarecer dúvidas, auxiliar no processo de <br /> aluguel ou compra e garantir que sua experiência seja a <br /> melhor possível.</p>
          <button className={styles.botao}>Fale Conosco</button>
        </div>
        <div>
          <Image
            src="/assets/cliente/mulher-ajudal 1 (1).png"
            className={styles.mulher}
            width={1200}
            height={630}
            alt="Imagem decorativa"
          />
        </div>
      </div>
      </main>
)
}