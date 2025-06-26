import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  console.log(
    "Setting optional method:",
    body.selected_optional_method,
    "from workflow",
    body.workflow_name,
    "and source",
    body.workflow_step_name
  );

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage2/set_optional_method?workflow_name=${body.workflow_name}&workflow_step_name=${body.workflow_step_name} `,
      { selected_optional_method: body.selected_optional_method }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Axios error:", error);
    return NextResponse.json(
      { error: "Failed to set optional method" },
      { status: (error as AxiosError).status }
    );
  }
};
