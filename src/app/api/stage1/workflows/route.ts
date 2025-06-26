import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/stage1/get_workflows`
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Axios error:", error);
    return NextResponse.json(
      { error: "Failed to get workflows" },
      { status: (error as AxiosError).status }
    );
  }
};
