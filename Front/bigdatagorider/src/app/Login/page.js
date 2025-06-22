"use client";
import Image from "next/image";
import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter
import Header from "@/components/header";
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export default function Login() { // Renomeado para Login para clareza
  const router = useRouter(); // Inicializa o router
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
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Logado com sucesso!");
        
        // Lógica de redirecionamento com base no tipo de usuário
        if (data.tipo_usuario === 'cliente') {
          router.push('/Servicos'); // Rota para clientes
        } else if (data.tipo_usuario === 'prestador') {
          router.push('/Prestador/servicos'); // Rota para prestadores
        } else {
          // Fallback para a página inicial se o tipo não for reconhecido
          router.push('/');
        }
      } else {
        // Exibe a mensagem de erro específica vinda do servidor
        alert(data.detail || "Usuário ou senha incorretos.");
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
      <Header />

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

      <Button className={styles.googleBtn} type="button">
        <Image
          src="/assets/login/Logo-Google-G.png"
          alt="Google"
          width={24}
          height={24}
          className={styles.googleBtnImg}
        />
        Continue com o Google
      </Button>

      <Input
        type="email"
        label="E-mail"
        placeholder="E-mail"
        value={email}
        onValueChange={setEmail}
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        className={styles.loginInput}
        autoComplete="email"
        required
      />

      <div className={styles.passwordWrapper}>
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Senha"
          placeholder="Senha"
          value={password}
          onValueChange={setPassword}
          isInvalid={!!errors.password}
          errorMessage={errors.password}
          className={styles.loginInput}
          autoComplete="current-password"
          required
        />
        <Button
          type="button"
          className={styles.togglePassword}
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          variant="light"
        >
          <Image
            src={
              showPassword
                ? "https://img.icons8.com/ios-glyphs/30/closed-eye.png"
                : "https://img.icons8.com/ios-glyphs/30/visible--v1.png"
            }
            alt=""
            width={24}
            height={24}
          />
        </Button>
      </div>

      <div className={styles.forgot}>
        <a href="/recuperar-senha" className={styles.forgotLink} aria-label="Recuperar senha">
          Esqueci minha senha
        </a>
      </div>

      <Button
        className={`${styles.loginBtn} ${loading ? styles.loginBtnLoading : ""}`}
        onClick={handleLogin}
        disabled={loading}
        aria-busy={loading}
        fullWidth
      >
        {loading ? 'Carregando...' : 'Entrar'}
      </Button>

      <div className={styles.signupLink}>
        Ainda não criou sua conta na GoRide?{' '}
        <a href="/Cadastro" className={styles.signupLinkA} aria-label="Cadastre-se">
          Cadastre-se
        </a>
        <br />
        <a href="/ajuda" className={styles.signupLinkA} aria-label="Ajuda">
          Preciso de ajuda
        </a>
      </div>
    </div>
          </div>
        </div>
      </div>
    </main>
  );
}