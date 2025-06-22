-- ====================================================================
-- ESTRUTURA OTIMIZADA PARA SERVIÇOS COM MÚLTIPLOS VEÍCULOS
-- ====================================================================

-- 1. MODIFICAR TABELA SERVICOS (adicionar campo quantidade)
ALTER TABLE Servicos 
ADD COLUMN QuantidadeVeiculos INT NOT NULL DEFAULT 1,
DROP COLUMN ID_Veiculo_Alocado; -- Remove referência a veículo único

-- 2. CRIAR TABELA DE ALOCAÇÃO DE VEÍCULOS PARA SERVIÇOS
CREATE TABLE IF NOT EXISTS ServicoVeiculos (
    ID_ServicoVeiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Servico INT NOT NULL,
    ID_Veiculo INT NOT NULL,
    ID_Prestador INT NOT NULL, -- Para facilitar consultas
    Status ENUM('Alocado', 'Em Uso', 'Concluido', 'Cancelado') DEFAULT 'Alocado',
    DataAlocacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DataInicio TIMESTAMP NULL,
    DataConclusao TIMESTAMP NULL,
    FOREIGN KEY (ID_Servico) REFERENCES Servicos(ID_Servico) ON DELETE CASCADE,
    FOREIGN KEY (ID_Veiculo) REFERENCES Veiculos(ID_Veiculo) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador) REFERENCES Usuarios(ID_Usuario) ON DELETE CASCADE,
    UNIQUE KEY uk_servico_veiculo (ID_Servico, ID_Veiculo)
);

-- 3. MODIFICAR TABELA PROPOSTAS (permitir múltiplos veículos por proposta)
ALTER TABLE PropostasServico 
DROP COLUMN ID_Veiculo; -- Remove referência a veículo único

-- 4. CRIAR TABELA DE VEÍCULOS POR PROPOSTA
CREATE TABLE IF NOT EXISTS PropostaVeiculos (
    ID_PropostaVeiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Proposta INT NOT NULL,
    ID_Veiculo INT NOT NULL,
    FOREIGN KEY (ID_Proposta) REFERENCES PropostasServico(ID_Proposta) ON DELETE CASCADE,
    FOREIGN KEY (ID_Veiculo) REFERENCES Veiculos(ID_Veiculo) ON DELETE CASCADE,
    UNIQUE KEY uk_proposta_veiculo (ID_Proposta, ID_Veiculo)
);

-- ====================================================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================================================
CREATE INDEX idx_servico_status ON Servicos(Status);
CREATE INDEX idx_servico_cliente ON Servicos(ID_Cliente);
CREATE INDEX idx_servico_prestador ON Servicos(ID_Prestador_Aceito);
CREATE INDEX idx_servicoveiculo_servico ON ServicoVeiculos(ID_Servico);
CREATE INDEX idx_servicoveiculo_status ON ServicoVeiculos(Status);
CREATE INDEX idx_propostas_servico ON PropostasServico(ID_Servico);
CREATE INDEX idx_proposta_veiculos ON PropostaVeiculos(ID_Proposta);

-- ====================================================================
-- VIEWS PARA FACILITAR CONSULTAS
-- ====================================================================

-- View para listar serviços com informações completas
CREATE VIEW VW_ServicosCompletos AS
SELECT 
    s.*,
    u_cliente.Nome as NomeCliente,
    u_prestador.Nome as NomePrestador,
    COUNT(sv.ID_Veiculo) as VeiculosAlocados,
    GROUP_CONCAT(v.Placa) as PlacasVeiculos
FROM Servicos s
LEFT JOIN Usuarios u_cliente ON s.ID_Cliente = u_cliente.ID_Usuario
LEFT JOIN Usuarios u_prestador ON s.ID_Prestador_Aceito = u_prestador.ID_Usuario
LEFT JOIN ServicoVeiculos sv ON s.ID_Servico = sv.ID_Servico
LEFT JOIN Veiculos v ON sv.ID_Veiculo = v.ID_Veiculo
GROUP BY s.ID_Servico;

-- View para listar propostas com veículos
CREATE VIEW VW_PropostasCompletas AS
SELECT 
    p.*,
    u.Nome as NomePrestador,
    COUNT(pv.ID_Veiculo) as QuantidadeVeiculos,
    GROUP_CONCAT(v.Placa) as PlacasVeiculos,
    GROUP_CONCAT(v.Tipo) as TiposVeiculos
FROM PropostasServico p
LEFT JOIN Usuarios u ON p.ID_Prestador = u.ID_Usuario
LEFT JOIN PropostaVeiculos pv ON p.ID_Proposta = pv.ID_Proposta
LEFT JOIN Veiculos v ON pv.ID_Veiculo = v.ID_Veiculo
GROUP BY p.ID_Proposta;
