"use client";
import Header from "@/components/Header";
import { useResultsStore } from "@/stores/results.store";
import React, { useRef } from "react";
import styles from "@/styles/results.module.css";

import { DataGrid } from "@mui/x-data-grid";
import { MdArrowUpward } from "react-icons/md";

const ResultsPage = () => {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const { results } = useResultsStore();

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 8,
      filename: "resultados.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const handleExportHTML = () => {
    const data = JSON.stringify(results);

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${results?.search_term}</title>
  <style>
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      overflow-x: hidden;
    }

    body {
      display: flex;
      background-color: white;
    }

    .side-nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 240px;
      height: 100vh;
      background-color: #f9f9f9;
      overflow-y: auto;
      padding: 20px;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }

    .nav-section {
      margin-bottom: 16px;
    }

    .nav-section p {
      font-weight: bold;
      margin: 0;
      cursor: pointer;
      padding: 4px 8px;
      transition: background-color 0.2s ease;
    }

    .nav-section p:hover {
      background-color: #f0f0f0;
      border-radius: 4px;
    }

    .subnav a {
      display: block;
      padding: 4px 12px;
      color: #333;
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-decoration: none;
    }

    .subnav a:hover {
      background-color: #e0e0e0;
      border-radius: 4px;
    }

    .content {
      margin-left: 240px;
      padding: 20px;
      width: calc(100% - 240px);
    }

    h1, h2, h3 {
      scroll-margin-top: 100px;
    }

    h2{
      margin-top: 24px;
    }

    h3{
      margin-top: 16px;
    }

    .table-wrapper {
      overflow-x: auto;
      margin-top: 16px;
      max-width: 100%;
    }

    table {
      border-collapse: collapse;
      min-width: 600px;
      width: 100%;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }

    th {
      background-color: #f0f0f0;
    }

    a {
      color: #1976d2;
    }

    td a {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="side-nav" id="sidebar"></div>
  <div class="content" id="content"></div>

  <script>
    const results = ${data};

    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (!results || !results.categories) {
      content.innerHTML = '<p>No hay datos.</p>';
    } else {
      const h1 = document.createElement('h1');
      h1.textContent = 'Resultados de "' + results.search_term + '"';
      content.appendChild(h1);

      results.categories.forEach(category => {
        // Sidebar section
        const navDiv = document.createElement('div');
        navDiv.className = 'nav-section';

        const sectionTitle = document.createElement('p');
        sectionTitle.textContent = category.section;
        sectionTitle.onclick = () => {
          document.getElementById('fuente-' + category.section)?.scrollIntoView({ behavior: 'smooth' });
        };
        navDiv.appendChild(sectionTitle);

        const subnav = document.createElement('div');
        subnav.className = 'subnav';

        category.content.forEach(method => {
          const a = document.createElement('a');
          a.textContent = method.title;
          a.onclick = () => {
            document.getElementById(category.section + '-' + method.title)?.scrollIntoView({ behavior: 'smooth' });
          };
          subnav.appendChild(a);
        });

        navDiv.appendChild(subnav);
        sidebar.appendChild(navDiv);

        // Content section
        const sectionContainer = document.createElement('div');
        sectionContainer.id = 'fuente-' + category.section;

        const h2 = document.createElement('h2');
        h2.textContent = category.section;
        sectionContainer.appendChild(h2);

        category.content.forEach(method => {
          const methodContainer = document.createElement('div');
          methodContainer.id = category.section + '-' + method.title;

          const h3 = document.createElement('h3');
          h3.textContent = method.title;
          methodContainer.appendChild(h3);

          if (method.data && method.data.length > 0) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            Object.keys(method.data[0]).forEach(key => {
              const th = document.createElement('th');
              th.textContent = key;
              headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            method.data.forEach(row => {
              const tr = document.createElement('tr');
              Object.entries(row).forEach(([key, value]) => {
                const td = document.createElement('td');
                const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
                if (isUrl) {
                  const link = document.createElement('a');
                  link.href = value;
                  link.textContent = value;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
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
            wrapper.appendChild(table);
            methodContainer.appendChild(wrapper);
          }

          sectionContainer.appendChild(methodContainer);
        });

        content.appendChild(sectionContainer);
      });

      // Add final credit note after all content
      const creditDiv = document.createElement('div');
      creditDiv.style.marginTop = '3rem';
      creditDiv.style.paddingTop = '2rem';
      creditDiv.style.borderTop = '1px solid #ccc';
      creditDiv.style.fontStyle = 'italic';
      creditDiv.style.color = '#666';
      creditDiv.style.textAlign = 'center';

      const creditText = document.createElement('p');
      creditText.textContent = 'Informe elaborado mediante la colaboración del Departamento de Sistemas Informáticos de la UPM y el IIER del ISCIII';

      creditDiv.appendChild(creditText);
      content.appendChild(creditDiv);
    }
  </script>
</body>
</html>
`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${results?.search_term}.html`;
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
      <button
        className={styles.backTopBtn}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <MdArrowUpward size={20} color="var(--color-white)" />
      </button>
      <section className={styles.head}>
        <h1>Resultados de {`"${results.search_term}"`}</h1>
        <div className={styles.actionBtns}>
          <button onClick={() => handleExportHTML()}>Exportar</button>
        </div>
      </section>
      <section className={styles.resultContentDiv}>
        <div className={styles.nav}>
          {results?.categories?.map((step) => (
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
                              id: index,
                              ...row,
                            }))}
                            columns={Object.keys(method.data[0]).map((key) => ({
                              field: key,
                              headerName: key,
                              flex: 1,
                              minWidth: key === "Function" ? 200 : 100,
                              renderCell: (params) => {
                                const value = params.value;
                                const isUrl =
                                  typeof value === "string" &&
                                  (value.startsWith("http://") ||
                                    value.startsWith("https://"));

                                if (isUrl) {
                                  return (
                                    <a
                                      href={value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.link}
                                    >
                                      {value}
                                    </a>
                                  );
                                }
                                return value;
                              },
                            }))}
                            sx={{
                              border: "none",
                              fontSize: "15px",
                              "& .MuiDataGrid-root": {
                                width: "100%",
                              },
                              "& .MuiDataGrid-cell": {
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                lineHeight: "1.4rem",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                overflowX: "hidden !important",
                              },
                            }}
                          />
                        </div>
                      ) : (
                        <div className={styles.resultValues}>
                          {method.data.map((value: any, index: number) => (
                            <div className={styles.value} key={index}>
                              {Object.entries(value).map(([key, value], i) => {
                                const isUrl =
                                  typeof value === "string" &&
                                  (value.startsWith("http://") ||
                                    value.startsWith("https://"));

                                return (
                                  <div key={i} className={styles.field}>
                                    <strong>{key}</strong>
                                    {isUrl ? (
                                      <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                      >
                                        {String(value)}
                                      </a>
                                    ) : (
                                      <p>{String(value)} </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )
                    ) : null}
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
