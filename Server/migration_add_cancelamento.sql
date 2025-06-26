-- Migration para adicionar campos de cancelamento na tabela Servicos

ALTER TABLE Servicos 
ADD COLUMN Data_Cancelamento TIMESTAMP NULL,
ADD COLUMN Cancelado_Por VARCHAR(20) NULL,
ADD COLUMN Motivo_Cancelamento TEXT NULL;

-- Criar índices para as novas colunas
CREATE INDEX idx_data_cancelamento ON Servicos(Data_Cancelamento);
CREATE INDEX idx_cancelado_por ON Servicos(Cancelado_Por);
