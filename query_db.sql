-- Tabela para armazenar os dados dos Clientes
CREATE TABLE IF NOT EXISTS Clientes (
    ID_Cliente INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Sobrenome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    Telefone VARCHAR(20),
    DataNascimento DATE NOT NULL,
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar os dados dos Prestadores de Serviço
CREATE TABLE IF NOT EXISTS Prestadores (
    ID_Prestador INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    Telefone VARCHAR(20),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Ativo', 'Inativo', 'Suspenso') DEFAULT 'Ativo'
);

-- Tabela para armazenar os veículos, ligados a um prestador
CREATE TABLE IF NOT EXISTS Veiculos (
    ID_Veiculo INT PRIMARY KEY AUTO_INCREMENT,
    ID_Prestador INT NOT NULL,
    Placa VARCHAR(10) NOT NULL UNIQUE,
    Tipo VARCHAR(50) NOT NULL,
    AnoFabricacao INT NOT NULL,
    CapacidadeToneladas DECIMAL(10, 2) NOT NULL,
    Status ENUM('Disponivel', 'Em Servico', 'Em Manutencao') DEFAULT 'Disponivel',
    FOREIGN KEY (ID_Prestador) REFERENCES Prestadores(ID_Prestador) ON DELETE CASCADE
);

-- Tabela central de Serviços
CREATE TABLE IF NOT EXISTS Servicos (
    ID_Servico INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Prestador_Aceito INT,
    ID_Veiculo_Alocado INT,
    Descricao TEXT NOT NULL,
    ValorInicialCliente DECIMAL(10, 2) NULL,
    ValorFinalAcordado DECIMAL(10, 2) NULL,
    EnderecoOrigem VARCHAR(255) NOT NULL,
    EnderecoDestino VARCHAR(255) NOT NULL,
    Status ENUM('Aberto', 'Em Andamento', 'Concluido', 'Cancelado') NOT NULL DEFAULT 'Aberto',
    DataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DataInicioPrevisto DATETIME,
    DataConclusao DATETIME,
    FOREIGN KEY (ID_Cliente) REFERENCES Clientes(ID_Cliente),
    FOREIGN KEY (ID_Prestador_Aceito) REFERENCES Prestadores(ID_Prestador),
    FOREIGN KEY (ID_Veiculo_Alocado) REFERENCES Veiculos(ID_Veiculo)
);

-- Tabela de ligação para as propostas que os prestadores fazem para os serviços abertos
CREATE TABLE IF NOT EXISTS PropostasServico (
    ID_Proposta INT PRIMARY KEY AUTO_INCREMENT,
    ID_Servico INT NOT NULL,
    ID_Prestador INT NOT NULL,
    ID_Veiculo INT NOT NULL,
    ValorProposto DECIMAL(10, 2) NOT NULL,
    Mensagem TEXT,
    Status ENUM('Pendente', 'Aceita', 'Recusada') NOT NULL DEFAULT 'Pendente',
    DataProposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Servico) REFERENCES Servicos(ID_Servico) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prestador) REFERENCES Prestadores(ID_Prestador) ON DELETE CASCADE,
    FOREIGN KEY (ID_Veiculo) REFERENCES Veiculos(ID_Veiculo) ON DELETE CASCADE
);
