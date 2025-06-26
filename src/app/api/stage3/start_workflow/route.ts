import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  console.log("Starting workflow", body.workflow_name);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage3/start_workflow?workflow_name=${body.workflow_name}`
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Axios error:", error);
    return NextResponse.json(
      { error: "Failed to star workflow" },
      { status: (error as AxiosError).status }
    );
  }
};
