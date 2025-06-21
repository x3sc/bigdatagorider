"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './vantagens.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function VantagensCliente() {
  const router = useRouter();

  const handleCadastro = () => {
    router.push('/Cadastro/VantagensCliente/CadastroCliente');
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src="/assets/cliente/mulher-ajudal 1 (1).png"
            alt="Vantagens Cliente"
            width={500}
            height={500}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1>Vantagens de ser nosso Cliente</h1>
          <p>Encontre os melhores profissionais para resolver seus problemas do dia a dia com rapidez e segurança.</p>
          <ul>
            <li>✅ Acesso a uma vasta rede de profissionais qualificados.</li>
            <li>✅ Agendamento fácil e rápido de serviços.</li>
            <li>✅ Pagamento seguro diretamente pela plataforma.</li>
            <li>✅ Avaliações e comentários para te ajudar a escolher.</li>
          </ul>
          <button onClick={handleCadastro} className={styles.button}>
            Quero ser Cliente
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
