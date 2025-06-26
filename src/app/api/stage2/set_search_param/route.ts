import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage2/set_search_param?workflow_name=${body.workflow_name}`,
      { search_id: body.search_id }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set search param" },
      { status: (error as AxiosError).status }
    );
  }
};
