import { authOptions } from "@/app/api/auth/[...nextauth]/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Films/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new film" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error saving new film:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new film" },
      { status: 500 }
    );
  }
}
