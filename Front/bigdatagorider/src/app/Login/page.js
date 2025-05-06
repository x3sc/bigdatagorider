"use client";
import Image from "next/image";
import "./style.css";
import { useState } from "react";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido";
    
    if (!password) newErrors.password = "Senha é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      setLoading(true);
      try {
        // Simulação de chamada API
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Login realizado com:\nE-mail: ${email}\nSenha: ${password}`);
      } catch (error) {
        console.error("Erro no login:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <main>
      <div className="top-bar">
        <Image 
          src="/assets/login/LOGO 1.png" 
          alt="Logo GoRide"
          width={100}
          height={45}
          priority
        />
      </div>

      <div className="container">
        <div className="main-content">
          <div className="content-wrapper">
            <div className="left">
              <Image 
                src="/assets/login/homem 1 (1).png"
                alt="Homem apontando"
                width={500}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '500px'
                }}
              />
            </div>

            <div className="login-box">
              <h2>Acessar minha conta</h2>
              
              <button className="google-btn">
                <Image 
                  src="/assets/login/Logo-Google-G.png" 
                  alt="Google"
                  width={50}
                  height={50}
                 
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
              />
              {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
              
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                <button 
                  type="button" 
                  className="toggle-password"
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
              {errors.password && <span id="password-error" className="error-message">{errors.password}</span>}

              <div className="forgot">
                <a href="#" aria-label="Recuperar senha">Esqueci minha senha</a>
              </div>
              
              <button 
                className={`login ${loading ? 'loading' : ''}`}
                onClick={handleLogin}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Carregando...' : 'Entrar'}
              </button>
              
              <div className="signup-link">
                Ainda não criou sua conta na GoRide? <a href="#" aria-label="Cadastre-se">Cadastre-se</a><br/>
                <a href="#" aria-label="Ajuda">Preciso de ajuda</a>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <div className="column logo">
            <Image 
              src="/assets/login/LOGO 1.png"
              alt="Logo GoRide" 
              width={100}
              height={45}
            />
            <p>Sua jornada, nossa missão</p>
            <div className="social-icons">
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