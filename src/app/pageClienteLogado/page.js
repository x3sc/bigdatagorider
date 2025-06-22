import Header from "@/components/header";
import Tabs from "@/components/Tabs/Tabs";
import BarraLateral from "@/components/BarraLateral/barraLateral";
import styles from "./pageClienteLogado.css";
import CategoriaTag from "@/components/CategoriaTag/categoriaTag";

export default function PageClienteLogado() {
  return (
    <main>
      <Header />
      <Tabs />
      <section className="bodyPage">
        <BarraLateral />
        <div className="elementosDir">
          <div className="barraPesquisar"></div>
          <div className="ofertas">
            <CategoriaTag />
            <div className="textoTopo">
              <h1>São Paulo -SP → Rio de Janeiro - RJ</h1>
              <div className="tagPreco">
                <h4>R$ 50-140</h4>
              </div>
            </div>

            <div className="infos">
              <h6>Publicado há: 1 hora</h6>
              <h6>Vagas: 04</h6>
              <h6>Data da viagem: 08/05/2025</h6>
            </div>

            <div className="descricao">
              <h6>
                Olá! Estou oferecendo uma viagem confortável e segura de São
                Paulo para o Rio de Janeiro. Carro espaçoso, com
                ar-condicionado, água mineral e muito conforto para garantir uma
                experiência agradável.<br></br>
                <br></br>Sou motorista responsável, com experiência em viagens
                longas e sempre focado no bem-estar dos passageiros.<br></br>
                <br></br>Valor acessível, com possibilidade de combinar pontos
                de encontro em locais estratégicos para facilitar sua partida.
                <br></br>
                <br></br>Se você está buscando uma viagem tranquila e sem
                preocupação, entre em contato!
              </h6>
            </div>

            <button>Reservar Agora</button>
          </div>

          <div className="ofertas">
            <CategoriaTag />
            <div className="textoTopo">
              <h1>São Paulo -SP → Rio de Janeiro - RJ</h1>
              <div className="tagPreco">
                <h4>R$ 50-140</h4>
              </div>
            </div>

            <div className="infos">
              <h6>Publicado há: 1 hora</h6>
              <h6>Vagas: 04</h6>
              <h6>Data da viagem: 08/05/2025</h6>
            </div>

            <div className="descricao">
              <h6>
                Olá! Estou oferecendo uma viagem confortável e segura de São
                Paulo para o Rio de Janeiro. Carro espaçoso, com
                ar-condicionado, água mineral e muito conforto para garantir uma
                experiência agradável.<br></br>
                <br></br>Sou motorista responsável, com experiência em viagens
                longas e sempre focado no bem-estar dos passageiros.<br></br>
                <br></br>Valor acessível, com possibilidade de combinar pontos
                de encontro em locais estratégicos para facilitar sua partida.
                <br></br>
                <br></br>Se você está buscando uma viagem tranquila e sem
                preocupação, entre em contato!
              </h6>
            </div>

            <button>Reservar Agora</button>
          </div>

          <div className="ofertas">
            <CategoriaTag />
            <div className="textoTopo">
              <h1>São Paulo -SP → Rio de Janeiro - RJ</h1>
              <div className="tagPreco">
                <h4>R$ 50-140</h4>
              </div>
            </div>

            <div className="infos">
              <h6>Publicado há: 1 hora</h6>
              <h6>Vagas: 04</h6>
              <h6>Data da viagem: 08/05/2025</h6>
            </div>

            <div className="descricao">
              <h6>
                Olá! Estou oferecendo uma viagem confortável e segura de São
                Paulo para o Rio de Janeiro. Carro espaçoso, com
                ar-condicionado, água mineral e muito conforto para garantir uma
                experiência agradável.<br></br>
                <br></br>Sou motorista responsável, com experiência em viagens
                longas e sempre focado no bem-estar dos passageiros.<br></br>
                <br></br>Valor acessível, com possibilidade de combinar pontos
                de encontro em locais estratégicos para facilitar sua partida.
                <br></br>
                <br></br>Se você está buscando uma viagem tranquila e sem
                preocupação, entre em contato!
              </h6>
            </div>

            <button>Reservar Agora</button>
          </div>
        </div>
      </section>
    </main>
  );
}
