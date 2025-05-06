import Image from 'next/image';
import styles from '../app/styles/Header.module.css';

export default function Header({ onLoginClick }) {
  return (
    <nav className={styles.header}>
      <div>
        <Image 
          src="/assets/home/LOGO.png" 
          className={styles.logo}
          width={100}
          height={100}
          alt="Logo GoRide"
        />
      </div>
      <div>
        <ul className={styles.menu}>
          <li><a className={styles.menuItem}>Início</a></li>
          <li><a className={styles.menuItem}>Viajar</a></li>
          <li><a className={styles.menuItem}>Dirigir</a></li>
          <li><a className={styles.menuItem}>Sobre Nós</a></li>
        </ul>
      </div>
      <div className={styles.actions}>
        <button className={styles.button} onClick={onLoginClick}>Fazer Login</button>
        <button className={styles.button}>Cadastre-se</button>
      </div>
    </nav>
  );
}