import axios from "axios";

export const setOptionalMethod = async (
  workflow_name: string,
  workflow_step_name: string,
  selected_optional_method: string
) => {
  try {
    const response = await axios.post("/api/stage2/set_optional_method", {
      workflow_name,
      workflow_step_name,
      selected_optional_method,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setOptionalMethod", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setOptionalMethod",
    };
  }
};

export const setFilter = async (
  workflow_name: string,
  workflow_step_name: string,
  workflow_step_method_name: string,
  filters: Record<string, any>
) => {
  try {
    const response = await axios.post("/api/stage2/set_filter", {
      workflow_name,
      workflow_step_name,
      workflow_step_method_name,
      filters,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setFilter", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setFilter",
    };
  }
};

export const setSearchParam = async (
  workflow_name: string,
  search_id: string
) => {
  try {
    const response = await axios.post("/api/stage2/set_search_param", {
      workflow_name,
      search_id,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setSearchParam", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setSearchParam",
    };
  }
};

export const setStage3 = async (workflow_name: string) => {
  try {
    const response = await axios.post("/api/stage2/set_stage_3", {
      workflow_name,
    });
    if (response.status !== 200) {
      return { success: false, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error setStage3", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error setStage3",
    };
  }
};
