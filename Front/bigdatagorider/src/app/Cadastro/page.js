import React from 'react';
import './style.css';

function Cadastro() {
  return (
    <div className="cadastro-container">
      <h2 className="form-title">Olá! Como você quer se cadastrar?</h2>
      <p className="form-subtitle">Selecione como deseja usar nossa plataforma</p>
      <div className="opcao-cadastro-container">
        <div className="opcao-cadastro">
          <h3 className="opcao-titulo">Quero soluções de mobilidade</h3>
          <p className="opcao-descricao">
            Alugue ou compre veículos com facilidade, agende transportes e tenha
            tudo sob controle em um lugar só.
          </p>
          <p className="opcao-ideal">
            Ideal para quem busca{" "}
            <strong>
              aluguel de carros por período
            </strong>,{" "}
            <strong>aquisição de veículos seminovos</strong>,{" "}
            <strong>serviços de transporte sob demanda</strong>.
          </p>
          <button className="opcao-botao">Quero ser cliente</button>
        </div>
        <div className="opcao-cadastro">
          <h3 className="opcao-titulo">Quero oferecer meus serviços</h3>
          <p className="opcao-descricao">
            Ofereça serviços profissionais com autonomia e benefícios
            exclusivos.
          </p>
          <p className="opcao-ideal">
            Plataforma ideal para:{" "}
            <strong>flexibilidade para trabalhar no seu ritmo</strong>,{" "}
            <strong>ferramentas profissionais de gestão</strong>,{" "}
            <strong>acesso a clientes qualificados</strong>.
          </p>
          <button className="opcao-botao">Quero trabalhar</button>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
