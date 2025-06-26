import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Drawer,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { MdClose, MdExpandMore } from "react-icons/md";
import styles from "@/styles/Search.module.css";
import { getSourcesWithMethods } from "@/services/stage1.service";
import {
  MethodType,
  SourcesWithMethods,
  WorkflowWithSources,
} from "@/types/workflow.types";
import {
  DraftFilter,
  DraftOptionalMethod,
} from "@/components/SearchComponent/SearchComponent";
import OptionalMethods from "./OptionalMethods";
import MinimumMethods from "./MinimumMethods";

interface SearchDrawerProps {
  workFlowSelected: WorkflowWithSources;
  openDrawer: boolean;
  selectedOptionalMethods: DraftOptionalMethod[];
  setOpenDrawer: (openDrawer: boolean) => void;
  setSelectedOptionalMethods: React.Dispatch<
    React.SetStateAction<DraftOptionalMethod[]>
  >;
  setFiltersDraft: React.Dispatch<React.SetStateAction<DraftFilter[]>>;
}

const SearchDrawer = ({
  workFlowSelected,
  openDrawer,
  selectedOptionalMethods,
  setOpenDrawer,
  setSelectedOptionalMethods,
  setFiltersDraft,
}: SearchDrawerProps) => {
  const [sourcesWithMethods, setSourcesWithMethods] =
    useState<SourcesWithMethods[]>();
  const [expandedSources, setExpandedSources] = useState<string[]>([]);

  const handleToggleSourceAccordion = (stepName: string) => {
    setExpandedSources(
      (prev) =>
        prev.includes(stepName)
          ? prev.filter((name) => name !== stepName) // close
          : [...prev, stepName] // open
    );
  };

  const [expandedMethods, setExpandedMethods] = useState<string[]>([]);

  const handleToggleMethodAccordion = (method: string) => {
    setExpandedMethods(
      (prev) =>
        prev.includes(method)
          ? prev.filter((name) => name !== method) // close
          : [...prev, method] // open
    );
  };

  const [sourcesDraft, setSourcesDraft] = useState<Record<string, any>>({});

  const handleApplyFilters = (filterDraft: DraftFilter) => {
    setFiltersDraft((prev) => {
      const index = prev.findIndex(
        (filter) =>
          filter.workflow_step_name === filterDraft.workflow_step_name &&
          filter.workflow_step_method_name ===
            filterDraft.workflow_step_method_name
      );

      if (index !== -1) {
        // Replace the existing filter
        const updated = [...prev];
        updated[index] = filterDraft;
        return updated;
      }
      return [...prev, filterDraft];
    });
  };

  const getSourcesMethods = useCallback(async () => {
    if (!workFlowSelected) return;
    try {
      const response = await getSourcesWithMethods(
        workFlowSelected?.name,
        workFlowSelected?.steps
      );
      if (!response.success) {
      }

      setSourcesWithMethods(response.data);
      //setSourcesEditable(response.data);

      const draft: Record<string, any> = {};

      response.data?.forEach((source) => {
        source.minimum_methods.methods.forEach((method: MethodType) => {
          draft[method.METHOD_ID] = method.METHOD_PARSER_FILTERS;
        });
        source.optional_methods.methods.forEach((method: MethodType) => {
          draft[method.METHOD_ID] = method.METHOD_PARSER_FILTERS;
        });
      });

      setSourcesDraft(draft);
    } catch (error) {
      console.log("Error getting sources with methods", error);
    }
  }, [workFlowSelected]);

  useEffect(() => {
    if (openDrawer) {
      getSourcesMethods();
    }
  }, [getSourcesMethods, openDrawer]);

  return (
    <Drawer
      open={openDrawer}
      anchor="right"
      onClose={() => {
        setOpenDrawer(false);
        setExpandedMethods([]);
      }}
      sx={{ width: 500 }}
    >
      <div className={styles.drawer}>
        <MdClose
          size={20}
          style={{ alignSelf: "flex-end", cursor: "pointer" }}
          onClick={() => setOpenDrawer(false)}
        />
        {sourcesWithMethods?.map((source) => {
          const isExpanded = expandedSources.includes(source.step_name);
          return (
            <Accordion
              key={source.step_name}
              sx={{
                boxShadow: "none",
                border: "none",
                "&.Mui-expanded .rotateIcon": {
                  transform: "rotate(180deg)",
                },
              }}
              disableGutters
              onChange={() => handleToggleSourceAccordion(source.step_name)}
            >
              <AccordionSummary>
                <div className={styles.accordionHead}>
                  <h6>{source.step_name}</h6>
                  <MdExpandMore
                    size={20}
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {source.minimum_methods.methods.map((method) => {
                  const isExpanded = expandedMethods.includes(method.METHOD_ID);
                  return (
                    <MinimumMethods
                      key={method.METHOD_ID}
                      method={method}
                      source={source}
                      isExpanded={isExpanded}
                      sourcesDraft={sourcesDraft}
                      setSourcesDraft={setSourcesDraft}
                      handleToggleMethodAccordion={handleToggleMethodAccordion}
                      handleApplyFilters={handleApplyFilters}
                    />
                  );
                })}

                {source.optional_methods.methods.length > 0 ? (
                  <div>
                    <p>Opcionales</p>
                  </div>
                ) : null}

                {source.optional_methods.methods.map((method) => {
                  const isExpanded = expandedMethods.includes(method.METHOD_ID);
                  return (
                    <OptionalMethods
                      key={method.METHOD_ID}
                      method={method}
                      source={source}
                      isExpanded={isExpanded}
                      sourcesDraft={sourcesDraft}
                      setSourcesDraft={setSourcesDraft}
                      selectedOptionalMethods={selectedOptionalMethods}
                      setSelectedOptionalMethods={setSelectedOptionalMethods}
                      handleToggleMethodAccordion={handleToggleMethodAccordion}
                      handleApplyFilters={handleApplyFilters}
                      setFiltersDraft={setFiltersDraft}
                    />
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </Drawer>
  );
};

export default SearchDrawer;
