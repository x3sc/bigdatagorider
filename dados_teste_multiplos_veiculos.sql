-- ====================================================================
-- DADOS DE TESTE PARA MÚLTIPLOS VEÍCULOS
-- ====================================================================

-- Inserir usuário prestador de teste (senha: 123456)
INSERT INTO Usuarios (Nome, Sobrenome, Email, Senha, Documento, Tipo) VALUES
('João', 'Silva', 'joao.prestador@teste.com', '$2b$12$exemplo_hash_senha', '12345678901', 1);

-- Inserir usuário cliente de teste (senha: 123456) 
INSERT INTO Usuarios (Nome, Sobrenome, Email, Senha, Documento, Tipo) VALUES
('Maria', 'Santos', 'maria.cliente@teste.com', '$2b$12$exemplo_hash_senha', '98765432100', 0);

-- Inserir veículos para o prestador
INSERT INTO Veiculos (ID_Prestador, Placa, Tipo, AnoFabricacao, CapacidadeToneladas, Status) VALUES
(2, 'ABC-1234', 'Caminhão Baú', 2020, 5.0, 'Disponivel'),
(2, 'DEF-5678', 'Caminhão Graneleiro', 2019, 8.0, 'Disponivel'),
(2, 'GHI-9012', 'Van', 2021, 1.5, 'Disponivel');

-- Inserir perfil do prestador
INSERT INTO Sobre_Prestador (ID_Prestador, Ocupacao_Cargo, Sobre_Mim) VALUES
(2, 'Transportador Autônomo', 'Experiência de 10 anos em transporte de cargas diversos.');

-- Inserir serviço que requer múltiplos veículos
INSERT INTO Servicos (ID_Cliente, Nome, Descricao, ValorInicialCliente, EnderecoOrigem, EnderecoDestino, DataServico, TipoVeiculoRequerido, QuantidadeVeiculos, Status) VALUES
(3, 'Mudança Comercial Grande', 'Transportar equipamentos de escritório para nova sede da empresa', 2500.00, 'Rua A, 123 - Centro', 'Av. B, 456 - Zona Sul', '2025-01-15', 'Caminhão', 2, 'Aberto');

-- ====================================================================
-- COMANDOS PARA TESTAR O FLUXO COMPLETO
-- ====================================================================

-- 1. Verificar serviços disponíveis
SELECT s.*, u.Nome as NomeCliente FROM Servicos s 
JOIN Usuarios u ON s.ID_Cliente = u.ID_Usuario 
WHERE s.Status = 'Aberto';

-- 2. Verificar veículos disponíveis do prestador
SELECT * FROM Veiculos WHERE ID_Prestador = 2 AND Status = 'Disponivel';

-- 3. Após enviar proposta, verificar propostas criadas
SELECT p.*, pv.ID_Veiculo, v.Placa, v.Tipo 
FROM PropostasServico p
LEFT JOIN PropostaVeiculos pv ON p.ID_Proposta = pv.ID_Proposta
LEFT JOIN Veiculos v ON pv.ID_Veiculo = v.ID_Veiculo
WHERE p.ID_Servico = 1;

-- 4. Após aceitar proposta, verificar alocação de veículos
SELECT sv.*, v.Placa, v.Tipo, s.Nome as NomeServico
FROM ServicoVeiculos sv
JOIN Veiculos v ON sv.ID_Veiculo = v.ID_Veiculo  
JOIN Servicos s ON sv.ID_Servico = s.ID_Servico
WHERE sv.ID_Servico = 1;

-- 5. Verificar status dos veículos após alocação
SELECT ID_Veiculo, Placa, Tipo, Status FROM Veiculos WHERE ID_Prestador = 2;

-- ====================================================================
-- VIEWS PARA MONITORAMENTO
-- ====================================================================

-- Ver propostas completas com veículos
SELECT * FROM VW_PropostasCompletas WHERE ID_Servico = 1;

-- Ver serviços completos com veículos alocados
SELECT * FROM VW_ServicosCompletos WHERE ID_Servico = 1;

-- Ver veículos disponíveis
SELECT * FROM VW_VeiculosDisponiveis WHERE ID_Prestador = 2;
