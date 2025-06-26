import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const workflow_name = searchParams.get("workflow_name");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage1/list_steps?workflow_name=${workflow_name}`
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
