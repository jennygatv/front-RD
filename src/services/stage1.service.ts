import { StepType, WorkflowWithSources } from "@/types/workflow.types";
import axios from "axios";

export const getWorkFlowsWithSources = async () => {
  try {
    const workflowResponse = await getWorkFlows();

    if (!workflowResponse.success) {
      return { success: false, data: workflowResponse.data };
    }

    const workflowsWithSources = await Promise.all(
      workflowResponse.data.workflows.map(
        async (workflow: WorkflowWithSources) => {
          const responseSources = await getSources(workflow.name);

          return {
            ...workflow,
            steps: responseSources.success ? responseSources.data.steps : [],
          };
        }
      )
    );

    console.log("workflowsWithSources", workflowsWithSources);

    return { success: true, data: workflowsWithSources };
  } catch (error) {
    console.log("error workflowsWithSources", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error workflowsWithSources",
    };
  }
};

export const getSourcesWithMethods = async (
  workflow: string,
  steps: StepType[]
) => {
  try {
    const sourcesWithMethods = await Promise.all(
      steps.map(async (step) => {
        const responseMinMethods = await getMinimumMethods(
          workflow,
          step.step_name
        );

        const responseOptionalMethods = await getOptionalMethods(
          workflow,
          step.step_name
        );

        return {
          ...step,
          minimum_methods: responseMinMethods.data.minimum_methods[0] || [],
          optional_methods:
            responseOptionalMethods.data.optional_methods[0] || [],
        };
      })
    );

    /*   console.log("sourcesWithMethods", sourcesWithMethods); */
    return { success: true, data: sourcesWithMethods };
  } catch (error) {
    console.log("error getSourcesWithMethods", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error getSourcesWithMethods",
    };
  }
};

export const getWorkFlows = async () => {
  try {
    const response = await axios.get("/api/stage1/workflows");
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error getWorkFlows", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error getWorkFlows",
    };
  }
};

export const getSources = async (workflow_name: string) => {
  try {
    const response = await axios.get(
      `/api/stage1/list_steps?workflow_name=${workflow_name}`
    );
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error getSources", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error getSources",
    };
  }
};

export const getMinimumMethods = async (
  workflow_name: string,
  workflow_step_name: string
) => {
  try {
    const response = await axios.get(
      `/api/stage1/minimum_methods?workflow_name=${workflow_name}&workflow_step_name=${workflow_step_name}`
    );
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error getMinimumMethods", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error getMinimumMethods",
    };
  }
};

export const getOptionalMethods = async (
  workflow_name: string,
  workflow_step_name: string
) => {
  try {
    const response = await axios.get(
      `/api/stage1/optional_methods?workflow_name=${workflow_name}&workflow_step_name=${workflow_step_name}`
    );
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error getOptionaleMethods", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error getOptionaleMethods",
    };
  }
};

export const getMethodFilters = async (
  workflow_name: string,
  workflow_step_name: string,
  workflow_step_method_name: string
) => {
  try {
    const response = await axios.get(
      `/api/stage1/optional_methods?workflow_name=${workflow_name}&workflow_step_name=${workflow_step_name}&workflow_step_method_name=${workflow_step_method_name}`
    );
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error getMethodFilters", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error getMethodFilters",
    };
  }
};

export const setStage2 = async (workflow_name: string) => {
  try {
    const response = await axios.post("/api/stage1/set_stage_2", {
      workflow_name,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setStage2", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setStage2",
    };
  }
};
