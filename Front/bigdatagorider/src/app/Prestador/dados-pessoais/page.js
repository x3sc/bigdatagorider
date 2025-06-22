"use client";

import React, { useState } from "react";
import Image from 'next/image';
import styles from './dados-pessoais.module.css';
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function DadosPessoais() {

return(
<>
    <div>
        <h1>Meus Dados</h1>
        <Image 
            src="/assets/dados-pessoais/rectangle.png"
            className={styles.rectangle}
            width={400}
            height={400}
            alt="Sublinhado"
        />
    </div>
    <div className={styles.qudrado}>
        <div>
            <h1>Informações gerais</h1>
            <h1>Senha</h1>
            <h1>Notificação e alertas</h1>
            <h1>Plano de Benefícios</h1>
            <h1>Segurança</h1>
            <h1>Conta</h1>
        </div>
        <div>
            <h1>Geral</h1>
            <textarea className={styles.textarea} placeholder="Primeiro nome"><p>Primeiro Nome</p></textarea>
            <textarea className={styles.textarea} placeholder="Sobrenome"><p>Sobrenome</p></textarea>
            <textarea className={styles.textarea} placeholder="Email"><p>Email</p></textarea>
        </div>
    </div>
</>
)
}