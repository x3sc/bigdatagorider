// Tipos de veículos padronizados para todo o sistema GoRide
export const TIPOS_VEICULO = [
    { key: "Carro", label: "Carro" },
    { key: "Moto", label: "Moto" },
    { key: "Van", label: "Van" },
    { key: "Van Refrigerada", label: "Van Refrigerada" },
    { key: "Caminhão", label: "Caminhão" },
    { key: "Caminhão Baú", label: "Caminhão Baú" },
    { key: "Caminhão Graneleiro", label: "Caminhão Graneleiro" },
    { key: "Caminhão Frigorífico", label: "Caminhão Frigorífico" },
    { key: "Carreta", label: "Carreta" },
    { key: "Bitrem", label: "Bitrem" }
];

// Função para obter o label a partir da chave
export const getTipoVeiculoLabel = (key) => {
    const tipo = TIPOS_VEICULO.find(t => t.key === key);
    return tipo ? tipo.label : key;
};

// Função para obter a chave a partir do label
export const getTipoVeiculoKey = (label) => {
    const tipo = TIPOS_VEICULO.find(t => t.label === label);
    return tipo ? tipo.key : label;
};
