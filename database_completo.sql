-- ====================================================================
-- CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS - BIG DATA GO RIDER
-- ====================================================================
-- Este arquivo contém toda a estrutura do banco de dados otimizada
-- para serviços com múltiplos veículos
-- ====================================================================

-- Remover tabelas existentes para recriar com nova estrutura
DROP TABLE IF EXISTS Avaliacoes;
DROP TABLE IF EXISTS Sobre_Prestador;
DROP TABLE IF EXISTS PropostaVeiculos;
DROP TABLE IF EXISTS PropostasServico;
DROP TABLE IF EXISTS ServicoVeiculos;
DROP TABLE IF EXISTS Servicos;
DROP TABLE IF EXISTS Veiculos;
DROP TABLE IF EXISTS Usuarios;

-- ====================================================================
-- 1. TABELA DE USUÁRIOS (CLIENTES E PRESTADORES UNIFICADOS)
-- ====================================================================
CREATE TABLE Usuarios (
    ID_Usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Sobrenome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Documento VARCHAR(18) NOT NULL UNIQUE, -- Para CPF (14 chars) ou CNPJ (18 chars)
    Telefone VARCHAR(20),
    DataNascimento DATE,
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Tipo de usuário: 0 para Cliente, 1 para Prestador, 2 para Ambos
    Tipo INT NOT NULL DEFAULT 0,
    INDEX idx_email (Email),
    INDEX idx_documento (Documento),
    INDEX idx_tipo (Tipo)
);

-- ====================================================================
-- 2. TABELA DE VEÍCULOS DOS PRESTADORES
-- ====================================================================
CREATE TABLE Veiculos (
    ID_Veiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Prestador INT NOT NULL,
    Placa VARCHAR(10) NOT NULL UNIQUE,
    Tipo VARCHAR(50) NOT NULL,
    AnoFabricacao INT NOT NULL,
    CapacidadeToneladas DECIMAL(10, 2) NOT NULL,
    Status ENUM('Disponivel', 'Em Servico', 'Em Manutencao') DEFAULT 'Disponivel',
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Prestador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    INDEX idx_prestador (ID_Prestador),
    INDEX idx_status (Status),
    INDEX idx_tipo (Tipo),
    INDEX idx_placa (Placa)
);

-- ====================================================================
-- 3. TABELA DE SERVIÇOS (COM SUPORTE A MÚLTIPLOS VEÍCULOS)
-- ====================================================================
CREATE TABLE Servicos (
    ID_Servico INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Prestador_Aceito INT NULL,
    Nome VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    ValorInicialCliente DECIMAL(10, 2) NULL,
    EnderecoOrigem VARCHAR(255) NOT NULL,
    EnderecoDestino VARCHAR(255) NOT NULL,
    DataServico DATE NOT NULL,
    TipoVeiculoRequerido VARCHAR(100) NOT NULL,
    QuantidadeVeiculos INT NOT NULL DEFAULT 1, -- NOVO CAMPO
    Status ENUM('Aberto', 'Em Andamento', 'Aguardando Confirmação', 'Concluido', 'Cancelado') NOT NULL DEFAULT 'Aberto',
    DataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Cliente) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador_Aceito) REFERENCES Usuarios(ID_Usuario) ON DELETE SET NULL,
    INDEX idx_cliente (ID_Cliente),
    INDEX idx_prestador_aceito (ID_Prestador_Aceito),
    INDEX idx_status (Status),
    INDEX idx_data_servico (DataServico),
    INDEX idx_tipo_veiculo (TipoVeiculoRequerido)
);

-- ====================================================================
-- 4. TABELA DE PROPOSTAS DE SERVIÇO (SEM REFERÊNCIA A VEÍCULO ÚNICO)
-- ====================================================================
CREATE TABLE PropostasServico (
    ID_Proposta INT PRIMARY KEY AUTO_INCREMENT,
    ID_Servico INT NOT NULL,
    ID_Prestador INT NOT NULL,
    ValorProposto DECIMAL(10, 2) NOT NULL,
    Mensagem TEXT,
    Status ENUM('Pendente', 'Aceita', 'Recusada') NOT NULL DEFAULT 'Pendente',
    DataProposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Servico) REFERENCES Servicos(ID_Servico) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    INDEX idx_servico (ID_Servico),
    INDEX idx_prestador (ID_Prestador),
    INDEX idx_status (Status),
    UNIQUE KEY uk_servico_prestador (ID_Servico, ID_Prestador)
);

-- ====================================================================
-- 5. TABELA DE VEÍCULOS OFERECIDOS POR PROPOSTA
-- ====================================================================
CREATE TABLE PropostaVeiculos (
    ID_PropostaVeiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Proposta INT NOT NULL,
    ID_Veiculo INT NOT NULL,
    DataAdicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Proposta) REFERENCES PropostasServico(ID_Proposta) ON DELETE CASCADE,
    FOREIGN KEY (ID_Veiculo) REFERENCES Veiculos(ID_Veiculo) ON DELETE CASCADE,
    INDEX idx_proposta (ID_Proposta),
    INDEX idx_veiculo (ID_Veiculo),
    UNIQUE KEY uk_proposta_veiculo (ID_Proposta, ID_Veiculo)
);

-- ====================================================================
-- 6. TABELA DE ALOCAÇÃO DE VEÍCULOS PARA SERVIÇOS
-- ====================================================================
CREATE TABLE ServicoVeiculos (
    ID_ServicoVeiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Servico INT NOT NULL,
    ID_Veiculo INT NOT NULL,
    ID_Prestador INT NOT NULL,
    Status ENUM('Alocado', 'Em Uso', 'Concluido', 'Cancelado') DEFAULT 'Alocado',
    DataAlocacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DataInicio TIMESTAMP NULL,
    DataConclusao TIMESTAMP NULL,
    Observacoes TEXT,
    FOREIGN KEY (ID_Servico) REFERENCES Servicos(ID_Servico) ON DELETE CASCADE,
    FOREIGN KEY (ID_Veiculo) REFERENCES Veiculos(ID_Veiculo) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    INDEX idx_servico (ID_Servico),
    INDEX idx_veiculo (ID_Veiculo),
    INDEX idx_prestador (ID_Prestador),
    INDEX idx_status (Status),
    UNIQUE KEY uk_servico_veiculo (ID_Servico, ID_Veiculo)
);

-- ====================================================================
-- 7. TABELA DE AVALIAÇÕES
-- ====================================================================
CREATE TABLE Avaliacoes (
    ID_Avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    ID_Usuario_Avaliador INT NOT NULL,
    ID_Prestador_Avaliado INT NOT NULL,
    ID_Servico INT NOT NULL,
    Nota INT NOT NULL CHECK (Nota >= 0 AND Nota <= 5),
    Comentario TEXT,
    DataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Usuario_Avaliador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador_Avaliado) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Servico) REFERENCES Servicos(ID_Servico) ON DELETE CASCADE,
    INDEX idx_avaliador (ID_Usuario_Avaliador),
    INDEX idx_prestador_avaliado (ID_Prestador_Avaliado),
    INDEX idx_servico (ID_Servico),
    INDEX idx_nota (Nota),
    UNIQUE KEY uk_avaliacao_servico (ID_Usuario_Avaliador, ID_Servico)
);

-- ====================================================================
-- 8. TABELA DE PERFIL DO PRESTADOR
-- ====================================================================
CREATE TABLE Sobre_Prestador (
    ID_Sobre_Prestador INT PRIMARY KEY AUTO_INCREMENT,
    ID_Prestador INT NOT NULL UNIQUE,
    Ocupacao_Cargo VARCHAR(255),
    Sobre_Mim TEXT,
    Historico_Profissional TEXT,
    Nota_Media DECIMAL(3, 2) DEFAULT 0.00,
    Total_Avaliacoes INT DEFAULT 0,
    DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Prestador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    INDEX idx_nota_media (Nota_Media)
);

-- ====================================================================
-- 9. VIEWS PARA FACILITAR CONSULTAS
-- ====================================================================

-- View para serviços com informações completas
CREATE VIEW VW_ServicosCompletos AS
SELECT 
    s.*,
    u_cliente.Nome as NomeCliente,
    u_cliente.Email as EmailCliente,
    u_prestador.Nome as NomePrestador,
    u_prestador.Email as EmailPrestador,
    COUNT(DISTINCT sv.ID_Veiculo) as VeiculosAlocados,
    GROUP_CONCAT(DISTINCT v.Placa ORDER BY v.Placa) as PlacasVeiculos,
    GROUP_CONCAT(DISTINCT v.Tipo ORDER BY v.Tipo) as TiposVeiculosAlocados
FROM Servicos s
LEFT JOIN Usuarios u_cliente ON s.ID_Cliente = u_cliente.ID_Usuario
LEFT JOIN Usuarios u_prestador ON s.ID_Prestador_Aceito = u_prestador.ID_Usuario
LEFT JOIN ServicoVeiculos sv ON s.ID_Servico = sv.ID_Servico AND sv.Status != 'Cancelado'
LEFT JOIN Veiculos v ON sv.ID_Veiculo = v.ID_Veiculo
GROUP BY s.ID_Servico;

-- View para propostas com veículos
CREATE VIEW VW_PropostasCompletas AS
SELECT 
    p.*,
    u.Nome as NomePrestador,
    u.Email as EmailPrestador,
    s.Nome as NomeServico,
    s.QuantidadeVeiculos as VeiculosNecessarios,
    COUNT(DISTINCT pv.ID_Veiculo) as VeiculosOferecidos,
    GROUP_CONCAT(DISTINCT v.Placa ORDER BY v.Placa) as PlacasVeiculos,
    GROUP_CONCAT(DISTINCT v.Tipo ORDER BY v.Tipo) as TiposVeiculos,
    GROUP_CONCAT(DISTINCT CONCAT(v.Tipo, ' (', v.Placa, ')') ORDER BY v.Placa) as DescricaoVeiculos
FROM PropostasServico p
LEFT JOIN Usuarios u ON p.ID_Prestador = u.ID_Usuario
LEFT JOIN Servicos s ON p.ID_Servico = s.ID_Servico
LEFT JOIN PropostaVeiculos pv ON p.ID_Proposta = pv.ID_Proposta
LEFT JOIN Veiculos v ON pv.ID_Veiculo = v.ID_Veiculo
GROUP BY p.ID_Proposta;

-- View para veículos disponíveis por prestador
CREATE VIEW VW_VeiculosDisponiveis AS
SELECT 
    v.*,
    u.Nome as NomePrestador,
    CASE 
        WHEN sv.ID_Veiculo IS NOT NULL THEN 'Em Serviço'
        ELSE v.Status
    END as StatusReal
FROM Veiculos v
JOIN Usuarios u ON v.ID_Prestador = u.ID_Usuario
LEFT JOIN ServicoVeiculos sv ON v.ID_Veiculo = sv.ID_Veiculo 
    AND sv.Status IN ('Alocado', 'Em Uso')
WHERE v.Status = 'Disponivel';

-- ====================================================================
-- 10. TRIGGERS PARA MANTER INTEGRIDADE E CÁLCULOS AUTOMÁTICOS
-- ====================================================================

-- Trigger para atualizar nota média do prestador
DELIMITER $$
CREATE TRIGGER tr_atualizar_nota_prestador AFTER INSERT ON Avaliacoes
FOR EACH ROW
BEGIN
    DECLARE nova_media DECIMAL(3,2);
    DECLARE total_avaliacoes INT;
    
    SELECT AVG(Nota), COUNT(*) INTO nova_media, total_avaliacoes
    FROM Avaliacoes 
    WHERE ID_Prestador_Avaliado = NEW.ID_Prestador_Avaliado;
    
    INSERT INTO Sobre_Prestador (ID_Prestador, Nota_Media, Total_Avaliacoes)
    VALUES (NEW.ID_Prestador_Avaliado, nova_media, total_avaliacoes)
    ON DUPLICATE KEY UPDATE 
        Nota_Media = nova_media,
        Total_Avaliacoes = total_avaliacoes;
END$$

-- Trigger para atualizar status do veículo quando alocado
CREATE TRIGGER tr_atualizar_status_veiculo_alocado AFTER INSERT ON ServicoVeiculos
FOR EACH ROW
BEGIN
    UPDATE Veiculos 
    SET Status = 'Em Servico' 
    WHERE ID_Veiculo = NEW.ID_Veiculo;
END$$

-- Trigger para liberar veículo quando serviço é concluído
CREATE TRIGGER tr_liberar_veiculo_concluido AFTER UPDATE ON ServicoVeiculos
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Concluido' AND OLD.Status != 'Concluido' THEN
        UPDATE Veiculos 
        SET Status = 'Disponivel' 
        WHERE ID_Veiculo = NEW.ID_Veiculo;
    END IF;
END$$

DELIMITER ;

-- ====================================================================
-- 11. DADOS INICIAIS PARA TESTE (OPCIONAL)
-- ====================================================================

-- Inserir usuário administrador para testes
INSERT INTO Usuarios (Nome, Sobrenome, Email, Senha, Documento, Tipo) VALUES
('Admin', 'Sistema', 'admin@bigdatagorider.com', '$2b$12$exemplo_hash_senha', '00000000000', 2);

-- ====================================================================
-- 12. ÍNDICES COMPOSTOS PARA PERFORMANCE
-- ====================================================================
CREATE INDEX idx_servicos_status_data ON Servicos(Status, DataServico);
CREATE INDEX idx_servicos_tipo_quantidade ON Servicos(TipoVeiculoRequerido, QuantidadeVeiculos);
CREATE INDEX idx_veiculos_prestador_status ON Veiculos(ID_Prestador, Status);
CREATE INDEX idx_veiculos_tipo_status ON Veiculos(Tipo, Status);
CREATE INDEX idx_propostas_servico_status ON PropostasServico(ID_Servico, Status);

-- ====================================================================
-- CONFIGURAÇÃO CONCLUÍDA
-- ====================================================================
-- Este banco de dados está otimizado para:
-- - Serviços com múltiplos veículos
-- - Propostas detalhadas com veículos específicos
-- - Controle de disponibilidade em tempo real
-- - Consultas eficientes com views pré-definidas
-- - Integridade automática via triggers
-- ====================================================================
