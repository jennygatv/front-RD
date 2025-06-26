"use client";
import React from "react";
import styles from "@/styles/Header.module.css";
import { useRouter } from "next/navigation";
import { useResultsStore } from "@/stores/results.store";

const Header = ({ showNewSearch = false }: { showNewSearch?: boolean }) => {
  const router = useRouter();
  const { setResults } = useResultsStore();

  return (
    <header className={styles.header}>
      <h1 onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
        LOGO
      </h1>

      {showNewSearch && (
        <button
          onClick={() => {
            router.push("/");
            setTimeout(() => {
              setResults(null);
            }, 3000);
          }}
        >
          Nueva búsqueda
        </button>
      )}
    </header>
  );
};

export default Header;
