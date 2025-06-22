'use client';
import React from 'react';
import styles from './cadastro.module.css';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';


function Cadastro() {
  const router = useRouter();
  const cadastroCliente = () => {
    router.push('/Cadastro/VantagensCliente');
  };

  const cadastroPrestador = () => {
    router.push('/Cadastro/VantagensPrestador');
  };

  return (
    <main>
      <Header />
      <div className={styles.cadastroContainer}>
        <h2 className={styles.formTitle}>Olá! Como você quer se cadastrar?</h2>
        <p className={styles.formSubtitle}>Selecione como deseja usar nossa plataforma</p>
        <div className={styles.opcaoCadastroContainer}>
          <div className={styles.opcaoCadastro}>
            <h3 className={styles.opcaoTitulo}>Quero soluções de mobilidade</h3>
            <p className={styles.opcaoDescricao}>
              Alugue ou compre veículos com facilidade, agende transportes e tenha
              tudo sob controle em um lugar só.
            </p>
            <p className={styles.opcaoIdeal}>
              Ideal para quem busca{" "}
              <strong>
                aluguel de carros por período
              </strong>,{" "}
              <strong>aquisição de veículos seminovos</strong>,{" "}
              <strong>serviços de transporte sob demanda</strong>.
            </p>
            <button className={styles.opcaoBotao} onClick={cadastroCliente}>Quero ser cliente</button>
          </div>
          <div className={styles.opcaoCadastro}>
            <h3 className={styles.opcaoTitulo}>Quero oferecer meus serviços</h3>
            <p className={styles.opcaoDescricao}>
              Ofereça serviços profissionais com autonomia e benefícios
              exclusivos.
            </p>
            <p className={styles.opcaoIdeal}>
              Plataforma ideal para:{" "}
              <strong>flexibilidade para trabalhar no seu ritmo</strong>,{" "}
              <strong>ferramentas profissionais de gestão</strong>,{" "}
              <strong>acesso a clientes qualificados</strong>.
            </p>
            <button className={styles.opcaoBotao} onClick={cadastroPrestador}>Quero trabalhar</button>
          </div>
        </div>
      </div>

      </main>
  );
}

export default Cadastro;
