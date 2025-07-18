import React, { useEffect, useState } from "react";
import styles from "@/styles/Search.module.css";
import { MdSearch } from "react-icons/md";
import { setStage2 } from "@/services/stage1.service";
import { WorkflowWithSources } from "@/types/workflow.types";
import {
  setFilter,
  setOptionalMethod,
  setSearchParam,
  setStage3,
} from "@/services/stage2.service";
import { startWorkflow } from "@/services/stage3.service";
import { useRouter } from "next/navigation";
import SelectWorkflow from "./SelectWorkflow";
import SearchDrawer from "./SearchDrawer/SearchDrawer";
import LoadingDialog from "./LoadingDialog";
import { useResultsStore } from "@/stores/results.store";

export interface DraftFilter {
  workflow_step_name: string;
  workflow_step_method_name: string;
  workflow_step_method_filters: any;
}

export interface DraftOptionalMethod {
  workflow_step_name: string;
  selected_optional_method: string;
}

const SearchComponent = ({
  isExpanded,
  workflowWithSources,
}: {
  isExpanded: boolean;
  workflowWithSources: WorkflowWithSources[];
}) => {
  const router = useRouter();
  const { setResults } = useResultsStore();
  const [workFlowSelected, setWorkflowSelected] = useState<WorkflowWithSources>(
    workflowWithSources[0]
  );

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [searchId, setSearchId] = useState<string>();
  const [loadingMsg, setLoadingMsg] = useState<string>("Changing to stage 2");
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedOptionalMethods, setSelectedOptionalMethods] = useState<
    DraftOptionalMethod[]
  >([]);
  /* 
  console.log("selectedOptionalMethods", selectedOptionalMethods); */

  const [filtersDraft, setFiltersDraft] = useState<DraftFilter[]>([]);
  console.log("filtersDraft", filtersDraft);

  useEffect(() => {
    setWorkflowSelected(workflowWithSources[0]);
  }, [workflowWithSources]);

  const handleStartWorkflow = async () => {
    setLoading(true);

    try {
      setLoadingMsg("Changing to stage 2");
      const responseStage2 = await setStage2(workFlowSelected?.name || "");

      if (!responseStage2.success) {
        console.log("error setting stage 2");
        return;
      }

      setLoadingMsg("Setting optional methods");

      const optMethodsRespons = await Promise.all(
        selectedOptionalMethods.map(async (method) => {
          const responseMethod = await setOptionalMethod(
            workFlowSelected?.name || "",
            method.workflow_step_name,
            method.selected_optional_method
          );
          if (!responseMethod.success) {
            return { success: false };
          }
          return { success: true };
        })
      );

      const failedOptMethods = optMethodsRespons.filter((res) => !res.success);
      if (failedOptMethods.length > 0) {
        console.error("Some filters failed to set:", failedOptMethods);
      }

      setLoadingMsg("Setting filters");

      const filtersResponse = await Promise.all(
        filtersDraft.map(async (filter) => {
          const responseFilter = await setFilter(
            workFlowSelected?.name || "",
            filter.workflow_step_name,
            filter.workflow_step_method_name,
            filter.workflow_step_method_filters
          );

          if (!responseFilter.success) {
            return { success: false, filter };
          }
          return { success: true };
        })
      );

      const failedFilters = filtersResponse.filter((res) => !res.success);
      if (failedFilters.length > 0) {
        console.error("Some filters failed to set:", failedFilters);
      }

      setLoadingMsg("Setting search param");

      if (!searchId) {
        console.log("introduce a search param");
        return;
      }

      const searchParamResponse = await setSearchParam(
        workFlowSelected?.name || "",
        searchId!
      );

      if (!searchParamResponse.success) {
        console.log("error setting search param");
        return;
      }

      setLoadingMsg("Changing to stage 3");

      const setStage3Response = await setStage3(workFlowSelected?.name || "");

      if (!setStage3Response.success) {
        console.log("error setting stage 3");
        return;
      }

      setLoadingMsg("Starting workflow");

      const startWorkflowReponse = await startWorkflow(
        workFlowSelected?.name || ""
      );

      if (!startWorkflowReponse.success) {
        console.log("error starting workflow");
        return;
      }

      console.log("startWorkflowReponse>>>>>>", startWorkflowReponse.data);

      setResults(startWorkflowReponse.data!);

      /*    const setStage1Response = await setStage1(workFlowSelected?.name || "");

      if (!setStage1Response.success) {
        console.log("error setting stage 1");
        return;
      } */

      router.push("/results");
    } catch (error) {
      console.log("error starting workflow:", error);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  return (
    <div
      className={styles.searchComponent}
      style={{ bottom: isExpanded ? "50%" : 0 }}
    >
      <div className={styles.searchBar}>
        <SelectWorkflow
          workFlowSelected={workFlowSelected}
          setWorkflowSelected={setWorkflowSelected}
          workflowWithSources={workflowWithSources}
        />
        <div className={styles.divider}></div>
        <div
          className={styles.inputDiv}
          style={{ width: "max-content", minWidth: 200, cursor: "pointer" }}
          onClick={() => setOpenDrawer(true)}
        >
          <label>Métodos</label>
          <p className={styles.methodsNames}>
            {workFlowSelected
              ? workFlowSelected?.steps.map((step) => step.step_name).join(", ")
              : "Loading"}
          </p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.inputDiv} style={{ width: "100%" }}>
          <label>Keyword</label>
          <input
            placeholder="Buscar término"
            onChange={(ev) => setSearchId(ev.target.value)}
          />
        </div>
        <button
          className={styles.searchBtn}
          onClick={(ev) => {
            ev.preventDefault();
            handleStartWorkflow();
          }}
        >
          <MdSearch size={28} color="var(--color-white)" />
        </button>
      </div>

      <SearchDrawer
        workFlowSelected={workFlowSelected}
        openDrawer={openDrawer}
        selectedOptionalMethods={selectedOptionalMethods}
        setOpenDrawer={setOpenDrawer}
        setSelectedOptionalMethods={setSelectedOptionalMethods}
        setFiltersDraft={setFiltersDraft}
      />

      <LoadingDialog open={loading} loadingMsg={loadingMsg || ""} />
    </div>
  );
};

export default SearchComponent;
