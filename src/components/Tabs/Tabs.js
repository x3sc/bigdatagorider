"use client";

import React, { useState } from "react";
import styles from "../Tabs/Tabs.module.css";

const Tabs = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState("transportes");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  return (
    <nav className={styles.tabsContainer}>
      <button
        className={`${styles.tabButton} ${
          activeTab === "transportes" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("transportes")}
      >
        Procure transportes
      </button>
      <button
        className={`${styles.tabButton} ${
          activeTab === "solicitados" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("solicitados")}
      >
        Serviços Solicitados
      </button>
      <button
        className={`${styles.tabButton} ${
          activeTab === "planos" ? styles.active : ""
        }`}
        onClick={() => handleTabClick("planos")}
      >
        Planos de assinatura
      </button>
    </nav>
  );
};

export default Tabs;
