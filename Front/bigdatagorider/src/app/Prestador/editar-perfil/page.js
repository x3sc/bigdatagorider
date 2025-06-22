"use client";

import React, { useState } from "react";
import Image from 'next/image';
import styles from './editar-perfil.module.css';
import HeaderPrestador from "@/components/headerPrestador";
import Footer from "@/components/footer";

export default function EditarPerfil() {

return(
<>
    <div className={styles.editarperfil}>  
        <h1>Editar Meu perfil</h1>
            <image
                src="/assets/editar-perfil/rectangle.png"
                className={styles.rectangle}
                width={400}
                height={400}
                alt="Sublinhado" 
            />
    </div>
    <div className={styles.perfil}>
            <div>
                <image
                    src="/assets/editar-perfil/foto.png"
                    className={styles.foto}
                    width={400}
                    height={400}
                    alt="Sublinhado" 
            />
            </div>
            <div>
                <h1>Nome</h1>
                <h2>Nenhuma avaliação</h2>
                <h1>Ocupação/Cargo</h1>
            </div>
    </div>
    <div>
        <button className={styles.salvar}>Salvar</button>
        <button className={styles.cancelar}>Cancelar</button>
    </div>
    <div className={styles.sobremim}>
        <h1>Sobre mim</h1>
        <textarea className={styles.textarea} placeholder="Escreva aqui..."></textarea>
    </div>
    <div>
        <h1>Historico Profissional</h1>
        <textarea className={styles.textarea} placeholder="Escreva aqui..."></textarea>
    </div>
</>
)
}