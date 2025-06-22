import React from 'react';
import styles from './termos.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function TermosDeUso() {
    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Termos de Uso</h1>
                    <div className={styles.content}>
                        <p>Bem-vindo à nossa plataforma. Ao utilizá-la, você concorda com os seguintes termos e condições.</p>
                        
                        <h2>1. Aceitação dos Termos</h2>
                        <p>Ao se cadastrar e utilizar nossos serviços, você confirma que leu, entendeu e concorda em estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte dos termos, não deve utilizar a plataforma.</p>

                        <h2>2. Descrição dos Serviços</h2>
                        <p>Nossa plataforma conecta clientes que necessitam de serviços de transporte e frete a prestadores de serviço qualificados. Nós facilitamos a negociação, o agendamento e o pagamento desses serviços.</p>

                        <h2>3. Cadastro e Conta</h2>
                        <p>Para utilizar a plataforma, você deve se cadastrar, fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.</p>

                        <h2>4. Conduta do Usuário</h2>
                        <p>Você concorda em não utilizar a plataforma para fins ilegais ou não autorizados. Você não deve, no uso do serviço, violar nenhuma lei em sua jurisdição.</p>

                        <h2>5. Negociação e Pagamento</h2>
                        <p>A plataforma permite que clientes e prestadores negociem os valores dos serviços. Uma vez acordado, o pagamento será processado através da plataforma. Nós cobramos uma taxa de serviço sobre cada transação concluída.</p>

                        <h2>6. Cancelamento e Reembolso</h2>
                        <p>As políticas de cancelamento e reembolso são específicas para cada serviço e devem ser acordadas entre o cliente e o prestador antes do início do trabalho. A plataforma pode mediar disputas, se necessário.</p>

                        <h2>7. Limitação de Responsabilidade</h2>
                        <p>Nossa plataforma é fornecida &quot;como está&quot;. Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais.</p>

                        <h2>8. Alterações nos Termos</h2>
                        <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre quaisquer alterações publicando os novos termos na plataforma. É sua responsabilidade revisar os termos periodicamente.</p>

                        <h2>9. Contato</h2>
                        <p>Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do nosso canal de suporte.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
