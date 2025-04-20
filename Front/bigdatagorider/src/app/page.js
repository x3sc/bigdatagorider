"use client";
import Image from "next/image";
import "./style/style.css";
import { useState } from "react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert('Preencha todos os campos.');
    } else {
      alert(`Tentando logar com:\nE-mail: ${email}\nSenha: ${password}`);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <main>
      <div className="top-bar">
        <Image 
          src="https://encurtador.com.br/x28xw" 
          alt="Logo GoRide"
          width={120}
          height={40}
        />
      </div>

      <div className="container">
        <div className="main-content">
          <div className="content-wrapper">
            <div className="left">
              <Image 
                src="/assets/cadastro/foto.png"
                alt="Homem apontando"
                width={500}
                height={300}
              />
            </div>

            <div className="login-box">
              <h2>Acessar minha conta</h2>
              <input 
                type="email" 
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image 
                  src={showPassword ? 
                    "https://img.icons8.com/ios-glyphs/30/closed-eye.png" : 
                    "https://img.icons8.com/ios-glyphs/30/visible--v1.png"}
                  alt="Mostrar senha"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  width={30}
                  height={30}
                />
              </div>

              <div className="forgot"><a href="#">Esqueci minha senha</a></div>
              <button className="login" onClick={handleLogin}>Entrar</button>
              
              <div className="signup-link">
                Ainda não criou sua conta na GoRide? <a href="#">Cadastre-se</a><br/>
                <a href="#">Preciso de ajuda</a>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <div className="column logo">
            <Image 
              src="https://encurtador.com.br/x28xw" 
              alt="Logo GoRide" 
              width={120}
              height={40}
            />
            <p>Sua jornada, nossa missão</p>
            <div className="social-icons">
              {['facebook', 'instagram-new', 'youtube-play'].map((icon) => (
                <a key={icon} href="#">
                  <Image 
                    src={`https://img.icons8.com/ios-glyphs/30/${icon}.png`}
                    alt={icon}
                    width={30}
                    height={30}
                  />
                </a>
              ))}
            </div>
          </div>

          {['Empresa', 'Serviços', 'Cidadania global'].map((title) => (
            <div key={title} className="column">
              <strong>{title}</strong>
              {title === 'Empresa' && (
                <>
                  <a href="#">Quem somos</a>
                  <a href="#">Trabalhe conosco</a>
                </>
              )}
              {title === 'Serviços' && (
                <>
                  <a href="#">Viajar</a>
                  <a href="#">Dirigir</a>
                  <a href="#">Fazer entregas</a>
                  <a href="#">Alugar</a>
                </>
              )}
              {title === 'Cidadania global' && (
                <>
                  <a href="#">Segurança</a>
                  <a href="#">Sustentabilidade</a>
                </>
              )}
            </div>
          ))}
        </footer>
      </div>
    </main>
  );
}