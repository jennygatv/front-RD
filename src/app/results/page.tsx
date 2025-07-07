"use client";
import Header from "@/components/Header";
import { useResultsStore } from "@/stores/results.store";
import React, { useRef } from "react";
import styles from "@/styles/results.module.css";

import { DataGrid } from "@mui/x-data-grid";

const ResultsPage = () => {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const { results } = useResultsStore();
  const pdfRef = useRef<HTMLDivElement>(null); // NEW
  console.log("results", results);

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 8,
      filename: "resultados.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // higher quality
        useCORS: true, // needed if you load external images
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const handleExportHTML = () => {
    // Aquí conviertes tus datos a JSON
    const data = JSON.stringify(results);

    // Construye un string HTML con los datos embebidos
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Informe interactivo</title>
<style>
  /* Aquí tus estilos CSS para la tabla, fonts, etc. */
  body { font-family: Arial, sans-serif; padding: 20px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 8px; }
  th { background-color: #f0f0f0; }
</style>
</head>
<body>
<h1>Informe interactivo</h1>

<div id="content"></div>

<script>
  // Datos inyectados desde React
  const results = ${data};

  // Función para crear tabla simple a partir de datos
  function renderResults(data) {
    const content = document.getElementById('content');
    if (!data || !data.categories) {
      content.innerHTML = '<p>No hay datos.</p>';
      return;
    }
    
    data.categories.forEach(category => {
      const sectionTitle = document.createElement('h2');
      sectionTitle.textContent = category.section;
      content.appendChild(sectionTitle);

      category.content.forEach(method => {
        const methodTitle = document.createElement('h3');
        methodTitle.textContent = method.title;
        content.appendChild(methodTitle);

        if (method.data && method.data.length > 0) {
          const table = document.createElement('table');
          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');

          // Header row
          const headerRow = document.createElement('tr');
          Object.keys(method.data[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);

          // Data rows
          method.data.forEach(row => {
            const tr = document.createElement('tr');
            Object.entries(row).forEach(([key, value]) => {
              const td = document.createElement('td');
              
              // Detectar si es una URL o si la columna contiene "link" o "url"
              const isUrl = typeof value === 'string' && 
                (value.startsWith('http://') || value.startsWith('https://') || 
                 key.toLowerCase().includes('link') || 
                 key.toLowerCase().includes('url'));
              
              if (isUrl) {
                const link = document.createElement('a');
                link.href = value;
                link.textContent = value;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.color = '#1976d2';
                link.style.textDecoration = 'underline';
                td.appendChild(link);
              } else {
                td.textContent = value;
              }
              
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });

          table.appendChild(thead);
          table.appendChild(tbody);
          content.appendChild(table);
        }
      });
    });
  }

  // Renderiza la tabla con los datos
  renderResults(results);
</script>
</body>
</html>
`;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe-interactivo.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <main className={styles.main}>
        <Header showNewSearch />
        <p>No workflow selected</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Header showNewSearch />
      <section className={styles.head}>
        <h1>Resultados de {`"${results.search_term}"`}</h1>
        <div className={styles.actionBtns}>
          {/*  <button onClick={handleExportPDF}>Exportar PDF</button> */}
          <button onClick={() => handleExportHTML()}>Exportar</button>
        </div>
      </section>
      <section className={styles.resultContentDiv}>
        <div className={styles.nav}>
          {results?.categories.map((step) => (
            <div key={step.section} className={styles.navDiv}>
              <p
                id={`fuente-${step.section}`}
                onClick={() =>
                  refs.current[`fuente-${step.section}`]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                {step.section}
              </p>
              <div className={styles.subnav}>
                {step.content.map((method, index) => (
                  <a
                    key={index}
                    onClick={() =>
                      refs.current[
                        `${step.section}-${method.title}`
                      ]?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    {method.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div ref={pdfRef} className={styles.resultContent}>
          {results?.categories.map((step) => (
            <div
              key={step.section}
              className={styles.resultDiv}
              ref={(el) => {
                refs.current[`fuente-${step.section}`] = el;
              }}
            >
              <h6>{step.section}</h6>
              <div className={styles.resultMethodsDiv}>
                {step.content.map((method, index) => (
                  <div
                    key={index}
                    className={styles.resultMethod}
                    ref={(el) => {
                      refs.current[`${step.section}-${method.title}`] = el;
                    }}
                  >
                    <p id={`#fuente-${step.section}-${method.title}`}>
                      {method.title}
                    </p>
                    {method.data.length > 0 ? (
                      method.display === "table" ? (
                        <div className={styles.tableDiv}>
                          <DataGrid
                            disableRowSelectionOnClick
                            getRowHeight={() => "auto"}
                            pagination
                            disableColumnResize
                            pageSizeOptions={[20, 50]}
                            initialState={{
                              pagination: {
                                paginationModel: { pageSize: 20, page: 0 },
                              },
                            }}
                            rows={method.data.map((row, index) => ({
                              id: index, // Required by DataGrid
                              ...row,
                            }))}
                            columns={Object.keys(method.data[0]).map((key) => ({
                              field: key,
                              headerName: key,
                              flex: 1,
                              minWidth: key === "Function" ? 200 : 100,
                              renderCell: (params) => {
                                // Detectar si es una URL o si la columna contiene "link" o "url"
                                const value = params.value;
                                const isUrl = typeof value === 'string' && 
                                  (value.startsWith('http://') || value.startsWith('https://') || 
                                   key.toLowerCase().includes('link') || 
                                   key.toLowerCase().includes('url'));
                                
                                if (isUrl) {
                                  return (
                                    <a 
                                      href={value} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ 
                                        color: '#1976d2', 
                                        textDecoration: 'underline',
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      {value}
                                    </a>
                                  );
                                }
                                return value;
                              }
                            }))}
                            sx={{
                              border: "none",
                              fontSize: "14px",
                              "& .MuiDataGrid-root": {
                                width: "100%",
                              },
                              "& .MuiDataGrid-cell": {
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                lineHeight: "1.4rem",
                                paddingTop: "10px", // Optional: better vertical spacing
                                paddingBottom: "10px",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                overflowX: "hidden !important", // 💡 this is crucial
                              },
                            }}
                          />
                        </div>
                      ) : (
                        <div className={styles.resultValues}>
                          {method.data.map((value: any, index: number) => (
                            <div className={styles.value} key={index}>
                              {Object.entries(value).map(([key, value], i) => {
                                // Detectar si es una URL o si la columna contiene "link" o "url"
                                const isUrl = typeof value === 'string' && 
                                  (value.startsWith('http://') || value.startsWith('https://') || 
                                   key.toLowerCase().includes('link') || 
                                   key.toLowerCase().includes('url'));
                                
                                return (
                                  <div key={i} className={styles.field}>
                                    <strong>{key}</strong> 
                                    <p>
                                      {isUrl ? (
                                        <a 
                                          href={value} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          style={{ 
                                            color: '#1976d2', 
                                            textDecoration: 'underline',
                                            cursor: 'pointer' 
                                          }}
                                        >
                                          {String(value)}
                                        </a>
                                      ) : (
                                        String(value)
                                      )}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )
                    ) : null}

                    {/* <div className={styles.resultValues}>
                      {method.data.map((value: any, index: number) => (
                        <div className={styles.value} key={index}>
                          {Object.entries(value).map(([key, value], i) => (
                            <div key={i} className={styles.field}>
                              <strong>{key}</strong> <p>{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ResultsPage;
