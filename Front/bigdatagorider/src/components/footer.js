import React from "react";
import styles from "../app/Login/login.module.css"; // Altere o caminho se seu CSS estiver em outro local
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerColumn} ${styles.footerLogoText}`}>
            <Image 
              src="/assets/login/LOGO 1.png"
              alt="Logo GoRide" 
              width={100}
              height={45}
            />
            <p className={styles.footerLogoText}>Sua jornada, nossa missão</p>
            <div className={styles.footerSocialIcons}>
              {['facebook', 'instagram-new', 'youtube-play'].map((icon) => (
                <a 
                  key={icon} 
                  href="#" 
                  aria-label={icon}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Image 
                    src={`https://img.icons8.com/ios-glyphs/30/${icon}.png`}
                    alt=""
                    width={30}
                    height={30}
                    className={styles.footerSocialIconImg}
                  />
                </a>
              ))}
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
    </footer>
  );
}