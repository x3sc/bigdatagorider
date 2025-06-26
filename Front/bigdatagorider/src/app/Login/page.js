"use client";
import Image from "next/image";
import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Input, Button, Card, CardBody, Divider, RadioGroup, Radio } from '@heroui/react';

export default function Login() { // Renomeado para Login para clareza
  const router = useRouter(); // Inicializa o router
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState('cliente'); // Estado para o tipo de usuário
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
        body: JSON.stringify({ email, password, tipo: userType === 'cliente' ? 0 : 1 }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userType', userType);

        alert("Logado com sucesso!");
        if (userType === 'cliente') {
          router.push('/Cliente/Dashboard');
        } else {
          router.push('/Prestador/Dashboard');
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
  return (    <main className={styles.main}>
      <Header />

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftSection}>
            <Image 
              src="/assets/login/homem 1 (1).png"
              alt="Homem apontando"
              width={500}
              height={400}
              className={styles.heroImage}
            />
          </div>

          <div className={styles.rightSection}>
            <Card className={styles.loginCard}>
              <CardBody className={styles.cardBody}>
                <div className={styles.logoSection}>
                  <Image
                    src="/assets/login/LOGO 1.png"
                    alt="GoRider Logo"
                    width={120}
                    height={60}
                    className={styles.logo}
                  />
                </div>

                <h1 className={styles.title}>Acessar minha conta</h1>

                <RadioGroup
                  value={userType}
                  onValueChange={setUserType}
                  orientation="horizontal"
                  className={styles.userTypeSelector}
                  color="danger"
                >
                  <Radio value="cliente" className={styles.radioOption}>
                    Cliente
                  </Radio>
                  <Radio value="prestador" className={styles.radioOption}>
                    Prestador
                  </Radio>
                </RadioGroup>

                <Button
                  variant="bordered"
                  startContent={
                    <Image
                      src="/assets/login/Logo-Google-G.png"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                  }
                  className={styles.googleButton}
                  size="lg"
                >
                  Continue com o Google
                </Button>

                <Divider className={styles.divider} />

                <div className={styles.inputGroup}>
                  <Input
                    type="email"
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onValueChange={setEmail}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: styles.input,
                      inputWrapper: styles.inputWrapper
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onValueChange={setPassword}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                    variant="bordered"
                    size="lg"
                    endContent={                      <Button
                        isIconOnly
                        variant="light"
                        onClick={togglePasswordVisibility}
                        className={styles.eyeButton}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </Button>
                    }
                    classNames={{
                      input: styles.input,
                      inputWrapper: styles.inputWrapper
                    }}
                  />
                </div>

                <div className={styles.forgotPassword}>
                  <Button
                    as="a"
                    href="/recuperar-senha"
                    variant="light"
                    size="sm"
                    className={styles.forgotLink}
                  >
                    Esqueci minha senha
                  </Button>
                </div>

                <Button
                  color="danger"
                  size="lg"
                  className={styles.loginButton}
                  onClick={handleLogin}
                  isLoading={loading}
                  fullWidth
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className={styles.signupSection}>
                  <p className={styles.signupText}>
                    Ainda não criou sua conta na GoRider?{' '}
                    <Button
                      as="a"
                      href="/Cadastro"
                      variant="light"
                      size="sm"
                      className={styles.signupLink}
                    >
                      Cadastre-se
                    </Button>
                  </p>
                  <Button
                    as="a"
                    href="/ajuda"
                    variant="light"
                    size="sm"
                    className={styles.helpLink}
                  >
                    Preciso de ajuda
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}