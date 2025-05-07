"use client";
import Image from "next/image";
import styles from "./login.module.css";
import { useState } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";


export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/Login');
  };

  const handleCadastroClick = () => {
    router.push('/Cadastro');
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Logado com sucesso!");
        // window.location.href = "/dashboard";
      } else {
        alert("Usuário ou senha incorretos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor. Tente novamente.");
      console.error("Erro:", error);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <main>

      <Header onLoginClick={handleLoginClick} 
      onCadastroClick={handleCadastroClick}/>

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <div className={styles.left}>
              <Image 
                src="/assets/login/homem 1 (1).png"
                alt="Homem apontando"
                width={500}
                height={400}
                className={styles.leftImg}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '500px'
                }}
              />
            </div>

            <div className={styles.loginBox}>
              <h2 className={styles.loginBoxTitle}>Acessar minha conta</h2>
              
              <button className={styles.googleBtn}>
                <Image 
                  src="/assets/login/Logo-Google-G.png" 
                  alt="Google"
                  width={50}
                  height={50}
                  className={styles.googleBtnImg}
                />
                Continue com o Google
              </button>

              <input 
                type="email" 
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                className={styles.loginInput}
              />
              {errors.email && <span id="email-error" className={styles.errorMessage}>{errors.email}</span>}
              
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  className={styles.loginInput}
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Image 
                    src={showPassword ? 
                      "https://img.icons8.com/ios-glyphs/30/closed-eye.png" : 
                      "https://img.icons8.com/ios-glyphs/30/visible--v1.png"}
                    alt=""
                    width={30}
                    height={30}
                  />
                </button>
              </div>
              {errors.password && <span id="password-error" className={styles.errorMessage}>{errors.password}</span>}

              <div className={styles.forgot}>
                <a href="#" className={styles.forgotLink} aria-label="Recuperar senha">Esqueci minha senha</a>
              </div>
              
              <button 
                className={`${styles.loginBtn} ${loading ? styles.loginBtnLoading : ""}`}
                onClick={handleLogin}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Carregando...' : 'Entrar'}
              </button>
              
              <div className={styles.signupLink}>
                Ainda não criou sua conta na GoRide? <a href="#" className={styles.signupLinkA} aria-label="Cadastre-se">Cadastre-se</a><br/>
                <a href="#" className={styles.signupLinkA} aria-label="Ajuda">Preciso de ajuda</a>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </main>
  );
}