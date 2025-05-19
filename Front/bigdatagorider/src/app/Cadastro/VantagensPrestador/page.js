"use client";

import React, { useState } from "react";
import Image from 'next/image';
import styles from '../../styles/Prestador.module.css';
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function VantagensPrestador() {

return(
<main>
      <div>
        <Header />
      </div>
        <div className={styles.container}>
          <p>Bem-Vindo(a)</p>
          <h1>Conecte-se a Novas <br /> Oportunidades</h1>
          <h2>Trabalhe conosco e aumente suas <br /> oportunidades. Torne-se um prestador <br /> de serviços agora mesmo!</h2>
           <button className={styles.botao}>Cadastre-se</button>
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
        <h1><b>Transforme Seu Trabalho <br /> em oportunidade!</b></h1>
        <p><b>Junte-se à nossa plataforma e ofereça seus serviços de <br /> transporte para milhares de clientes.</b></p>
        <p>Com um sistema flexível e seguro, você tem autonomia para<br />definir sua disponibilidade e garantir sua renda.</p>
        <button className={styles.botao}>Quero me cadastrar</button>
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
        <img src="/assets/prestador/como-funciona-cards2.png"
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
    <p><strong>Flexibilidade <br /> Total</strong><br />Defina seus horários e escolha <br /> quando trabalhar.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Pagamentos <br /> Seguros</strong><br />Receba seus ganhos de forma <br /> rápida e transparente.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Suporte Contínuo</strong>Atendimento dedicado para auxiliar<br /> você sempre que precisar.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Alta Demanda</strong><br />Conecte-se a um grande número <br /> de clientes prontos para contratar <br /> seus serviços.</p>
  </div>
  <div className={styles.item}>
    <div className={styles.bolinha}></div>
    <p><strong>Baixa Taxa de Comissão</strong><br />Condições justas para maximizar seu lucro.</p>
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