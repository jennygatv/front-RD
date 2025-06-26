import { DraftFilter } from "@/components/SearchComponent/SearchComponent";
import { MethodType, SourcesWithMethods } from "@/types/workflow.types";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import React from "react";
import { MdAdd } from "react-icons/md";
import styles from "@/styles/Search.module.css";

interface MinimumMethodsProps {
  method: MethodType;
  source: SourcesWithMethods;
  isExpanded: boolean;
  sourcesDraft: Record<string, any>;
  setSourcesDraft: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleToggleMethodAccordion: (method: string) => void;
  handleApplyFilters: (filterDraft: DraftFilter) => void;
}

const MinimumMethods = ({
  method,
  source,
  isExpanded,
  sourcesDraft,
  setSourcesDraft,
  handleToggleMethodAccordion,
  handleApplyFilters,
}: MinimumMethodsProps) => {
  return (
    <Accordion
      key={method.METHOD_ID}
      sx={{
        boxShadow: "none",
        borderRadius: "4px",
        border: "2px solid var(--color-black)",
      }}
      disableGutters
      onChange={() => handleToggleMethodAccordion(method.METHOD_ID)}
    >
      <AccordionSummary>
        <div className={styles.sourceRow}>
          <p className={styles.methodsNames}>{method.METHOD_ID}</p>
          {isExpanded ? (
            <div className={styles.source}>
              <button
                className={styles.addFilters}
                style={{ color: "#03bbc2" }}
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  handleApplyFilters({
                    workflow_step_name: source.step_name,
                    workflow_step_method_name: method.METHOD_ID,
                    workflow_step_method_filters:
                      sourcesDraft[method.METHOD_ID],
                  });
                }}
              >
                Apply
              </button>
            </div>
          ) : (
            <div className={styles.addFilters}>
              <MdAdd size={16} /> Filtros
            </div>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <textarea
          typeof="code"
          className={styles.codeBlock}
          defaultValue={
            sourcesDraft?.[method.METHOD_ID]
              ? JSON.stringify(sourcesDraft[method.METHOD_ID], null, 2)
              : JSON.stringify(method.METHOD_PARSER_FILTERS, null, 2)
          }
          onChange={(e: any) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setSourcesDraft((prev) => ({
                ...prev,
                [method.METHOD_ID]: parsed,
              }));
            } catch (error) {
              console.log("Invalid JSON:", error);
            }
          }}
        />
        {/*   <JSONInput
                        key={
                          method.METHOD_ID +
                          JSON.stringify(sourcesDraft?.[method.METHOD_ID])
                        }
                        id="json_editor"
                        placeholder={
                          sourcesDraft?.[method.METHOD_ID] ??
                          method.METHOD_PARSER_FILTERS
                        }
                        onKeyPressUpdate
                        confirmGood
                        locale={locale}
                        width="100%"
                        height="200px"
                        onChange={(e: any) => {
                          console.log("JSONInput onChange", e.jsObject);
                          if (!e.error) {
                            setSourcesDraft((prev) => ({
                              ...prev,
                              [method.METHOD_ID]: e.jsObject,
                            }));
                          }
                        }}
                      /> */}
      </AccordionDetails>

      {/* <div className={styles.sourceRow}>
                      <p className={styles.filterName}>Prioridad de clases</p>
                      <button className={styles.addFilters}>
                        <MdAdd size={16} />
                      </button>
                    </div>
                    <DragAndDropList />
                    <div className={styles.sourceRow}>
                      <p className={styles.filterName}>
                        Prioridad de propiedades
                      </p>
                      <button className={styles.addFilters}>
                        <MdAdd size={16} />
                      </button>
                    </div> */}
    </Accordion>
  );
};

export default MinimumMethods;
