// Front/bigdatagorider/src/components/servicos/Transportes.js
"use client";

import React, { useState, useEffect } from 'react';

const Transportes = () => {
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                // A porta foi alterada para 8000, que é a porta do backend FastAPI
                const response = await fetch('http://localhost:8000/api/servicos');
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

export default Transportes;
