"use client";
import React from "react";
import styles from "@/styles/Header.module.css";
import { useRouter } from "next/navigation";
import { useResultsStore } from "@/stores/results.store";

const Header = ({
  showNewSearch = false,
  color = "var(--color-primary)",
}: {
  showNewSearch?: boolean;
  color?: string;
}) => {
  const router = useRouter();
  const { setResults } = useResultsStore();

  return (
    <header className={styles.header}>
      <h1
        onClick={() => router.push("/")}
        style={{ cursor: "pointer", color: color }}
      >
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
