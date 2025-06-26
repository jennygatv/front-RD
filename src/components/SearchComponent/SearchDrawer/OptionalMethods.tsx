import {
  DraftFilter,
  DraftOptionalMethod,
} from "@/components/SearchComponent/SearchComponent";
import { MethodType, SourcesWithMethods } from "@/types/workflow.types";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import React from "react";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import styles from "@/styles/Search.module.css";

interface OptionalMethodsProps {
  method: MethodType;
  source: SourcesWithMethods;
  isExpanded: boolean;
  sourcesDraft: Record<string, any>;
  setSourcesDraft: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  selectedOptionalMethods: DraftOptionalMethod[];
  setSelectedOptionalMethods: React.Dispatch<
    React.SetStateAction<DraftOptionalMethod[]>
  >;
  handleToggleMethodAccordion: (method: string) => void;
  handleApplyFilters: (filterDraft: DraftFilter) => void;
  setFiltersDraft: React.Dispatch<React.SetStateAction<DraftFilter[]>>;
}

const OptionalMethods = ({
  method,
  source,
  isExpanded,
  sourcesDraft,
  setSourcesDraft,
  selectedOptionalMethods,
  handleToggleMethodAccordion,
  setSelectedOptionalMethods,
  handleApplyFilters,
  setFiltersDraft,
}: OptionalMethodsProps) => {
  const handleSetOptionalMethod = (optMethodDraft: DraftOptionalMethod) => {
    setSelectedOptionalMethods((prev: DraftOptionalMethod[]) => {
      const isIncluded = prev.find(
        (m) =>
          m.selected_optional_method ===
            optMethodDraft.selected_optional_method &&
          m.workflow_step_name === optMethodDraft.workflow_step_name
      );

      if (isIncluded) {
        setFiltersDraft((prevFilters) =>
          prevFilters.filter(
            (filter) =>
              !(
                filter.workflow_step_name ===
                  optMethodDraft.workflow_step_name &&
                filter.workflow_step_method_name ===
                  optMethodDraft.selected_optional_method
              )
          )
        );
        return prev.filter(
          (opt) =>
            opt.selected_optional_method !==
            optMethodDraft.selected_optional_method
        );
      }
      return [...prev, optMethodDraft];
    });
  };

  return (
    <Accordion
      key={method.METHOD_ID}
      sx={{
        boxShadow: "none",
        borderRadius: "4px",
        border: selectedOptionalMethods.find(
          (optMethod) => optMethod.selected_optional_method === method.METHOD_ID
        )
          ? "2px solid var(--color-black)"
          : "2px solid #d2d2d2",
      }}
      disableGutters
      onChange={() => handleToggleMethodAccordion(method.METHOD_ID)}
    >
      <AccordionSummary>
        <div className={styles.sourceRow}>
          <div className={styles.source} style={{ width: "100%" }}>
            <MdCheckCircle
              size={20}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                handleSetOptionalMethod({
                  workflow_step_name: source.step_name,
                  selected_optional_method: method.METHOD_ID,
                });
              }}
              color={
                selectedOptionalMethods.find(
                  (optMethod) =>
                    optMethod.selected_optional_method === method.METHOD_ID
                )
                  ? "var(--color-black)"
                  : "#d2d2d2"
              }
            />
            <p className={styles.methodsNames}>{method.METHOD_ID}</p>
          </div>
          {isExpanded ? (
            <div className={styles.source}>
              {/*  <button
                                className={styles.addFilters}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  setSourcesDraft((prev) => ({
                                    ...prev,
                                    [method.METHOD_ID]: {},
                                  }));
                                  handleApplyFilters({
                                    workflow_step_name: source.step_name,
                                    workflow_step_method_name: method.METHOD_ID,
                                    workflow_step_method_filters: {},
                                  });
                                }}
                              >
                                Reset
                              </button> */}
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
      </AccordionDetails>
    </Accordion>
  );
};

export default OptionalMethods;
