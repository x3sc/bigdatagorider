"use client";
import { useState, useEffect } from "react";
import styles from "../BarraLateral/barraLateral.module.css";

export default function BarraLateral({ onBuscar, onSelectBuscaSalva }) {
  const [buscasSalvas, setBuscasSalvas] = useState([]);
  const [form, setForm] = useState({
    categoria: [],
    data: "qualquer",
    modalidade: "todas",
    regiao: "todas",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedSearches")) || [];
    setBuscasSalvas(stored);
  }, []);

  const handleCheckbox = (value) => {
    setForm((prev) => {
      const nova = prev.categoria.includes(value)
        ? prev.categoria.filter((v) => v !== value)
        : [...prev.categoria, value];
      return { ...prev, categoria: nova };
    });
  };

  return (
    <aside className={styles.container}>
      <label className={styles.label}>Buscas salvas</label>
      <select
        className={styles.select}
        onChange={(e) => onSelectBuscaSalva(e.target.value)}
      >
        <option value="">selecionar</option>
        {buscasSalvas.map((b) => (
          <option key={b.id} value={b.id}>
            {b.label}
          </option>
        ))}
      </select>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Categorias</legend>
        {[
          "Todas as categorias",
          "Viagem",
          "Frete e mudança",
          "Entrega",
          "Aluguel",
        ].map((cat) => (
          <label key={cat} className={styles.checkbox}>
            <input
              type="checkbox"
              value={cat}
              onChange={() => handleCheckbox(cat)}
              checked={form.categoria.includes(cat)}
            />{" "}
            {cat}
          </label>
        ))}
      </fieldset>

      <label className={styles.label}>Data de publicação</label>
      <select
        className={styles.select}
        onChange={(e) => setForm({ ...form, data: e.target.value })}
      >
        <option value="qualquer">em qualquer momento</option>
        <option value="hoje">hoje</option>
        <option value="ultimos2dias">últimos 2 dias</option>
        <option value="semana">última semana</option>
      </select>

      <label className={styles.label}>Modalidade de trabalho</label>
      <div className={styles.modalidade}>
        {["todas", "fixo", "hora"].map((mod) => (
          <button
            key={mod}
            className={`${styles.button} ${
              form.modalidade === mod ? styles.buttonActive : ""
            }`}
            onClick={() => setForm({ ...form, modalidade: mod })}
            type="button"
          >
            {mod === "todas"
              ? "Todas"
              : mod === "fixo"
              ? "preço fixo"
              : "Por hora"}
          </button>
        ))}
      </div>

      <label className={styles.label}>Localização do prestador</label>
      <select
        className={styles.select}
        onChange={(e) => setForm({ ...form, regiao: e.target.value })}
      >
        <option value="todas">Todas as regiões</option>
        <option value="sp">São Paulo</option>
        <option value="rj">Rio de Janeiro</option>
        <option value="mg">Minas Gerais</option>
      </select>

      <button className={styles.saveBtn} type="button">
        Salvar busca personalizada
      </button>
      <button
        className={styles.buscar}
        onClick={() => onBuscar(form)}
        type="button"
      >
        Buscar
      </button>
    </aside>
  );
}
