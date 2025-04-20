"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <main>
         <div>
      <h1>Home</h1>
      <button 
        onClick={() => router.push('/Cadastro')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ir para Cadastro
      </button>
    </div>
    </main>
  );
}