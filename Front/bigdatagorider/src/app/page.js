"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/home.css";
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);

  // Dados do FAQ
  const faqItems = [
    {
      pergunta: "Como posso me cadastrar na GoRide?",
      resposta: "Basta clicar no botão 'Cadastre-se' no menu superior e preencher o formulário com seus dados. O processo leva menos de 1 minuto!"
    },
    {
      pergunta: "Quais são as formas de pagamento aceitas?",
      resposta: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), débito, PIX e transferência bancária."
    },
    {
      pergunta: "A GoRide possui seguro para os veículos?",
      resposta: "Sim, todos nossos veículos possuem seguro completo incluído no valor do aluguel ou serviço."
    },
    {
      pergunta: "Como funciona o cancelamento de reservas?",
      resposta: "Você pode cancelar gratuitamente até 24 horas antes da reserva. Após esse período, pode haver cobrança de taxa conforme nossa política."
    }
  ];

  // Função para alternar as respostas
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main>
      <nav className="header">
        <div>
          <Image 
            src="/assets/home/LOGO.png" 
            className="logo"
            width={1200}
            height={630}
            alt="Logo GoRide"
          />
        </div>
        <div>
          <ul className="li">
            <li><a className="ref">Início</a></li>
            <li><a className="ref">Viajar</a></li>
            <li><a className="ref">Dirigir</a></li>
            <li><a className="ref">Sobre Nós</a></li>
          </ul>
        </div>
        <div>
          <button className="botao">Fazer Login</button>
          <button className="botao">Cadastre-se</button>
        </div>
      </nav>

      <section>
        <div className="jornada">
          <p>Bem-Vindo(a) à GoRide</p>
          <h1 className="prioridade">Sua Jornada,<br/>nossa prioridade</h1>
          <p>Mobilidade sob medida, onde e quando <br/>você precisar</p>
        </div>
        <div>
          <button className="botao">Quero Começar Agora</button>
        </div>
      </section>

      <div className="mobilidade">
        <div>
          <Image 
            src="/assets/home/retangulo.png" 
            className="logo"
            width={1200}
            height={630}
            alt="Imagem de mobilidade"
          />
        </div>
        <div className="aviaozao">
          <h1>Encontre a Mobilidade<br/>Perfeita para você</h1>
          <p>Na <strong>Go Ride</strong>, conectamos você às <strong>melhores soluções</strong>
            de<br/><strong>transporte</strong>, seja para alugar,comprar, ou contratar serviços<br/>com segurança e
            praticidade</p>
          <div className="aviaozinho">
            <Image 
              src="/assets/home/logo-aviao 1.png" 
              className="aviao"
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Viaje com liberdade</p>
          </div>
          <div className="aviaozinho">
            <Image 
              src="/assets/home/logo-aviao 1.png" 
              className="aviao"
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Compre com Confiança</p>
          </div>
          <div className="aviaozinho">
            <Image 
              src="/assets/home/logo-aviao 1.png" 
              className="aviao"
              width={1200}
              height={630}
              alt="Ícone de avião"
            />
            <p>Contrate serviços sob medida</p>
          </div>
          <div className="experimente">
            <strong>Experimente agora</strong>
            <button className="botao">Cadastre-se em 1 minuto</button>
          </div>
        </div>
      </div>

      <div className="escolher">
        <h1>Por que escolher a Go Ride ?</h1>
        <Image 
          src="/assets/home/Rectangle 1018.png" 
          className="rectangle"
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>

      <div className="container">
        <div className="bola">
          <Image 
            src="/assets/home/computador.png" 
            className="circulo"
            width={1200}
            height={630}
            alt="Ícone de computador"
          />
          <p><b>Processo <br/>100% Online</b></p>
          <p>Veículos novos<br/>e revisados regularmente</p>
        </div>
        <div className="bola">
          <Image 
            src="/assets/home/Group 1171275239.png" 
            className="circulo"
            width={1200}
            height={630}
            alt="Ícone de ofertas"
          />
          <p><b>Ofertas <br/> exclusivas</b></p>
          <p>aluguel de curto ou longo<br/>prazo, financiamento facilitado</p>
        </div>
        <div className="bola">
          <Image 
            src="/assets/home/Group 1171275240.png" 
            className="circulo"
            width={1200}
            height={630}
            alt="Ícone de flexibilidade"
          />
          <p><b>Flexibilidade<br/>total</b></p>
          <p>Seguro completo e assistência 24/7<br/>para sua tranquilidade</p>
        </div>
        <div className="bola">
          <Image 
            src="/assets/home/Group 1171275241.png" 
            className="circulo"
            width={1200}
            height={630}
            alt="Ícone de suporte"
          />
          <p><b>Suporte<br/>dedicado</b></p>
          <p>Contratação digital com suporte especializado</p>
        </div>
      </div>

      <div className="meio">
        <h1>Como Funciona</h1>
      </div>

      <div className="quadrado">
        <div className="square">1 - Cadastre-se<br/>Rápido,simples e gratuito.</div>
        <div className="square">2 - Escolha seu serviço<br/>Aluguel, compra ou transporte.</div>
        <div className="square">3 - Aproveite!<br/>Tudo resolvido em poucos cliques.</div>
      </div>

      <div className="meio">
        <h1>Depoimento de<br/> Quem Já Usa</h1>
        <Image 
          src="/assets/home/Rectangle 1018.png" 
          className="rectangle"
          width={1200}
          height={630}
          alt="Retângulo decorativo"
        />
      </div>

      <div className="quadrado">
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
      </div>

      <div className="meio">
        <button className="botao">Quero fazer parte também</button>
      </div>

      <div className="pronto">
        <div className="comeco">
          <h1>Pronto para Começar ?</h1>
          <p>Seja para alugar, comprar ou trabalhar conosco,<br/> sua jornada começa aqui!</p>
          <strong>Cadastre-se agora e ganhe benefício exclusivo</strong>
          <button className="botao">Vamos lá</button>
        </div>
        <div>
          <Image 
            src="/assets/home/retangulo.png" 
            className="logo"
            width={1200}
            height={630}
            alt="Imagem decorativa"
          />
        </div>
      </div>

      {/* Seção FAQ Corrigida */}
      <div className="antesdafaq">
        <div>
          <div className="retangulo">
            <Image 
              src="/assets/home/retangulo.png" 
              className="logo"
              width={1200}
              height={630}
              alt="Imagem decorativa"
            />
          </div>
          <div className="faq"> 
            <h1>FAQ</h1>
            {faqItems.map((item, index) => (
              <div className="item" key={index}>
                <div 
                  className={`pergunta ${activeIndex === index ? 'active' : ''}`} 
                  onClick={() => toggleAnswer(index)}
                >
                  <p>{item.pergunta}</p>
                  <span className="toggle-icon">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </div>
                <div 
                  className={`resposta ${activeIndex === index ? 'show' : ''}`}
                >
                  <p>{item.resposta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="final">
        <div style={{ width: '300px', padding: '20px' }}>
          <Image 
            src="/assets/home/LOGO 1.png" 
            className="logo1"
            width={1200}
            height={630}
            alt="Logo alternativo"
          />
          <div className="redes">
            <Image 
              src="/assets/home/youtube-logo-white 1.png"
              width={1200}
              height={630}
              alt="YouTube"
            />
            <Image 
              src="/assets/home/X_logo_2023_(white) 1.png"
              width={1200}
              height={630}
              alt="Twitter/X"
            />
            <Image 
              src="/assets/home/Square-Facebook-Logo-PNG-Pic 1.png"
              width={1200}
              height={630}
              alt="Facebook"
            />
            <Image 
              src="/assets/home/Design sem nome (81) 1.png"
              width={1200}
              height={630}
              alt="Rede social"
            />
            <Image 
              src="/assets/home/Design sem nome (82) 1.png"
              width={1200}
              height={630}
              alt="Rede social"
            />
          </div>
        </div>
        <div>
          <strong>Empresa</strong>
          <ul>
            <li><a className="links">O que oferecemos</a></li>
            <li><a className="links">Investidores</a></li>
            <li><a className="links">Blog</a></li>
          </ul>
        </div>
        <div>
          <strong>Serviços</strong>
          <ul>
            <li><a className="links">Viajar</a></li>
            <li><a className="links">Dirigir</a></li>
            <li><a className="links">Fazer entregas</a></li>
            <li><a className="links"> Aluguéis</a></li>
          </ul>
        </div>
        <div>
          <strong>Cidadania global</strong>
          <ul>
            <li><a className="links">Segurança</a></li>
            <li><a className="links">Sustentabilidade</a></li>
          </ul>
        </div>
      </div>
    </main>
  );
}