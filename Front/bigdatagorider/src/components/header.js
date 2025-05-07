import Image from 'next/image';
import Link from 'next/link';
import styles from '../app/styles/Header.module.css';

export default function Header() {
  return (
    <nav className={styles.header}>
      <div>
        <Link href="/">
          <Image 
            src="/assets/home/LOGO.png" 
            className={styles.logo}
            width={100}
            height={100}
            alt="Logo GoRide"
          />
        </Link>
      </div>
      <div>
        <ul className={styles.menu}>
          <li><Link href="/" className={styles.menuItem}>Início</Link></li>
          <li><Link href="/viajar" className={styles.menuItem}>Viajar</Link></li>
          <li><Link href="/dirigir" className={styles.menuItem}>Dirigir</Link></li>
          <li><Link href="/sobre" className={styles.menuItem}>Sobre Nós</Link></li>
        </ul>
      </div>
      <div className={styles.actions}>
        <Link href="/Login" className={styles.button}>Fazer Login</Link>
        <Link href="/Cadastro" className={styles.button}>Cadastre-se</Link>
      </div>
    </nav>
  );
}