import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  console.log("posting filter:", typeof body.filters);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage2/set_filter?workflow_name=${body.workflow_name}&workflow_step_name=${body.workflow_step_name}&workflow_step_method_name=${body.workflow_step_method_name}`,
      { filters: body.filters }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Axios error:", error);
    return NextResponse.json(
      { error: "Failed to get list of sources" },
      { status: (error as AxiosError).status }
    );
  }
};
