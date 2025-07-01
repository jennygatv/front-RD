import axios from "axios";

export const startWorkflow = async (workflow_name: string) => {
  try {
    const response = await axios.post("/api/stage3/start_workflow", {
      workflow_name,
    });
    /*  if (response.status !== 200) {
      return { success: false, data: response.data };
    } */
    return {
      success: true,
      data: response.data.results,
    };
  } catch (error) {
    console.log("error startWorkflow", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error startWorkflow",
    };
  }
};

export const setStage1 = async (workflow_name: string) => {
  try {
    const response = await axios.post("/api/stage3/set_stage_1", {
      workflow_name,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setStage1", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setStage1",
    };
  }
};
