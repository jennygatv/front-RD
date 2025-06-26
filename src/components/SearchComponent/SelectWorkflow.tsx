import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import styles from "@/styles/Search.module.css";
import { WorkflowWithSources } from "@/types/workflow.types";
import { MdCheckCircle } from "react-icons/md";

interface SelectWorkflowProps {
  workflowWithSources: WorkflowWithSources[];
  workFlowSelected: WorkflowWithSources;
  setWorkflowSelected: (workFlowSelected: WorkflowWithSources) => void;
}

const SelectWorkflow = ({
  workflowWithSources,
  workFlowSelected,
  setWorkflowSelected,
}: SelectWorkflowProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className={styles.inputDiv}
      style={{ width: "max-content", minWidth: 200 }}
    >
      <label>Workflow</label>
      {workflowWithSources && workFlowSelected ? (
        <Select
          aria-label="workflow"
          value={workFlowSelected?.name}
          onChange={(ev) => {
            const selectedWorkflow = workflowWithSources?.find(
              (wf) => wf.name === (ev.target.value as string)
            );
            setWorkflowSelected(selectedWorkflow!);
          }}
          onClose={() => setHoveredItem(null)}
          sx={{
            maxHeight: 30,
            fontSize: "14px",
            borderRadius: "6px",
            padding: "0px",
            "& .MuiSelect-select": {
              paddingLeft: "0px !important",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent !important",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: 3,
                boxShadow:
                  "rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;",
                borderRadius: "16px",
                padding: "6px ",
              },
            },
          }}
        >
          {workflowWithSources?.map((wf) => (
            <MenuItem
              key={wf.name}
              value={wf.name}
              sx={{
                padding: "10px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
              className={styles.menuItem}
              onMouseEnter={(e) => setHoveredItem(wf.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={styles.selectItem}>
                <div className={styles.statusInd}></div>
                <p>{wf.name}</p>
              </div>
              <div
                className={styles.workflowHover}
                style={{ display: hoveredItem ? "flex" : "none" }}
              >
                {wf.steps.map((i) => (
                  <div className={styles.source} key={i.step_name}>
                    <MdCheckCircle size={20} color="#26bf26" />
                    <p>{i.step_name}</p>
                  </div>
                ))}
              </div>
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default SelectWorkflow;
