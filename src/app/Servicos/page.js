"use client";

import React, { useState, useEffect } from 'react';
import './abas-de-navegacao.module.css';
import Image from 'next/image';
import Header from "@/components/header";
import Footer from "@/components/footer";


const ConteudoTransportes = () => {
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/servicos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar serviços');
                }
                const data = await response.json();
                setServicos(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchServicos();
    }, []);

    return (
        <div>
            <h2>Transportes Disponíveis</h2>
            {servicos.length > 0 ? (
                <ul>
                    {servicos.map((servico) => (
                        <li key={servico.id}>
                            <h3>{servico.nome}</h3>
                            <p>{servico.descricao}</p>
                            <p>Preço Estimado: R$ {servico.preco_estimado.toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum serviço disponível no momento.</p>
            )}
        </div>
    );
};
const ConteudoServicos = () => 
<div>
    <div>
        <div><h1>Espera</h1></div>
        <div><h1>Em andamento</h1></div>
        <div><h1>Finalizado</h1></div>
    </div>
    <div>
        <div><h1>Trabalho 1</h1></div>
        <div></div>
        <div></div>
    </div>
    <div>
        <div><h1>Trabalho 2</h1></div>
        <div></div>
        <div></div>
    </div>
</div>;
const ConteudoPlanos = () => 
<div>
        <div>
            <h1>Um plano para cada etapa da sua carreira profissional</h1>
            <Image
                src="/assets/abas-de-navegacao/planos.png"
                alt="Planos de assinatura"
                width={500}
                height={300}
            />
        </div>
    <div>
        <div>
            <h2>Free</h2>
            <p>para quem prefere se dedicar a um projeto por vez</p>
            <h1>GRÁTIS</h1>
            <p>2 contatos semanais</p>
            <p>1 projetos em andamento</p>
            <p>Saques no início do mês</p>
            <button>Escolher plano</button>
        </div>
         <div>
            <h2>Beginner</h2>
            <p>para um projeto por vez.</p>
            <h1>21,90</h1><h3>/mês</h3>
            <p>Todos os itens do Plano Free, Mais:</p>
            <p>5 habilidades em seu perfil</p>
            <p>7 contatos semanais</p>
            <p>2 projetos em andamento</p>
            <p>Saques no meio do mês</p>
            <button>Escolher plano</button>
        </div>
        <div>
            <h2>Premium</h2>
            <p>Todos os itens do Plano Beginner, mais:</p>
            <h1>76,90</h1><h3>/mês</h3>
            <p>17 contatos semanais</p>
            <p>5 projetos em andamento</p>
            <p>Fazer e receber chamadas de vídeo</p>
            <p>Saques semanais</p>
            <button>Escolher plano</button>
        </div>
    </div>
    <div>
    <h1>FAQ</h1>
    </div>
</div>;

export default function AbasDeNavegacao() {
  const [abaAtiva, setAbaAtiva] = useState('Planos de assinatura');

  const abas = ['Procure transportes', 'Serviços Solicitados', 'Planos de assinatura'];

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'Procure transportes':
        return <ConteudoTransportes />;
      case 'Serviços Solicitados':
        return <ConteudoServicos />;
      case 'Planos de assinatura':
        return <ConteudoPlanos />;
      default:
        return null;
    }
  };

  return (
    <div className="container-abas">
      <nav className="menu-abas">
        {abas.map((aba) => (
          <button
            key={aba}
            className={abaAtiva === aba ? 'aba aba-ativa' : 'aba'}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba}
          </button>
        ))}
      </nav>

      <main className="conteudo-abas">
        {renderizarConteudo()}
      </main>
    </div>
  );
}