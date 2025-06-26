import React from "react";
import styles from "../app/styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogoSection}>
          <Image 
            src="/assets/login/LOGO 1.png"
            alt="Logo GoRide" 
            width={150}
            height={67}
            className={styles.footerLogo}
          />
          <p className={styles.footerLogoText}>Sua jornada, nossa missão</p>
          <div className={styles.footerSocialIcons}>
            <a 
              href="#" 
              aria-label="Facebook"
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.footerSocialIconLink}
            >
              <Image 
                src="/assets/home/Square-Facebook-Logo-PNG-Pic 1.png"
                alt="Facebook"
                width={24}
                height={24}
                className={styles.footerSocialIconImg}
              />
            </a>
            <a 
              href="#" 
              aria-label="Twitter"
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.footerSocialIconLink}
            >
              <Image 
                src="/assets/home/X_logo_2023_(white) 1.png"
                alt="Twitter"
                width={24}
                height={24}
                className={styles.footerSocialIconImg}
              />
            </a>
            <a 
              href="#" 
              aria-label="YouTube"
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.footerSocialIconLink}
            >
              <Image 
                src="/assets/home/youtube-logo-white 1.png"
                alt="YouTube"
                width={24}
                height={24}
                className={styles.footerSocialIconImg}
              />
            </a>
          </div>
        </div>
        
        <div className={styles.footerColumn}>
          <strong className={styles.footerColumnTitle}>Empresa</strong>
          <a href="#" className={styles.footerLink}>Quem somos</a>
          <a href="#" className={styles.footerLink}>Trabalhe conosco</a>
        </div>
        
        <div className={styles.footerColumn}>
          <strong className={styles.footerColumnTitle}>Serviços</strong>
          <a href="#" className={styles.footerLink}>Viajar</a>
          <a href="#" className={styles.footerLink}>Dirigir</a>
          <a href="#" className={styles.footerLink}>Fazer entregas</a>
          <a href="#" className={styles.footerLink}>Alugar</a>
        </div>
        
        <div className={styles.footerColumn}>
          <strong className={styles.footerColumnTitle}>Cidadania global</strong>
          <a href="#" className={styles.footerLink}>Segurança</a>
          <a href="#" className={styles.footerLink}>Sustentabilidade</a>
        </div>

        <div className={styles.footerCopyright}>
          <p>&copy; 2024 GoRide. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}