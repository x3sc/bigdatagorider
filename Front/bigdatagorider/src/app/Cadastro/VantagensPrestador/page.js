"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../VantagensCliente/vantagens.module.css'; // Reutilizando o mesmo CSS
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function VantagensPrestador() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push('/Cadastro/VantagensPrestador/CadastroPrestador');
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src="/assets/prestador/banner1.png"
            alt="Vantagens Prestador"
            width={500}
            height={500}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1>Vantagens de ser nosso Parceiro</h1>
          <p>Aumente sua visibilidade, conquiste mais clientes e gerencie seus serviços de forma eficiente.</p>
          <ul>
            <li>✅ Vitrine online para seus serviços.</li>
            <li>✅ Receba solicitações de serviços diretamente no seu perfil.</li>
            <li>✅ Gerenciamento de agenda e pagamentos integrado.</li>
            <li>✅ Acesso a uma base de clientes em crescimento.</li>
          </ul>
          <button onClick={handleCadastro} className={styles.button}>
            Quero ser Parceiro
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}