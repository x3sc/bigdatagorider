"use client";

import React from "react";
import styles from "./novaBusca.module.css";
import Header from "@/components/header";
import Fotter from "@/components/footer";

export default function NovaBuscaPage() {
  return (
    <main>
      <Header />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2>Filtros</h2>
          <label>
            <input type="checkbox" /> Viagem única
          </label>
          <label>
            <input type="checkbox" /> Recorrente
          </label>
          <select>
            <option>Últimas 24h</option>
            <option>Últimos 7 dias</option>
          </select>
          <select>
            <option>Presencial</option>
            <option>Remoto</option>
          </select>
          <select>
            <option>SP - São Paulo</option>
            <option>RJ - Rio de Janeiro</option>
          </select>
          <button className={styles.botao}>Buscar</button>
        </aside>

        <div className={styles.main}>
          <input
            type="text"
            placeholder="O que você procura hoje?"
            className={styles.searchInput}
          />

          <div className={styles.fretes}>
            <div className={styles.freteCard}>
              <div className={styles.titlePrincipal}>
                <h3>São Paulo - SP → Rio de Janeiro - RJ</h3>
                <div className={styles.precoTopo}>R$ 95.140</div>
              </div>

              <p className={styles.subtituloCard}>
                Publicado há 11 horas • Viagem única • Data da viagem:
                08/05/2025
              </p>
              <p>
                Olá! Estou oferecendo uma viagem confortável e segura de São
                Paulo para o Rio de Janeiro. Carro espaçoso, com
                ar-condicionado, água mineral e muito conforto para garantir uma
                experiência agradável. Sou motorista responsável, com
                experiência em viagens longas e sempre focado no bem-estar dos
                passageiros. Valor acessível, com possibilidade de combinar
                pontos de encontro em locais estratégicos para facilitar sua
                partida. Se você está buscando uma viagem tranquila e sem
                preocupação, entre em contato!
              </p>
              <div className={styles.cardFooter}>
                <button className={styles.botao2}>Reservar agora</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
