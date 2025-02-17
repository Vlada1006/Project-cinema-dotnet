import { authOptions } from "@/app/api/auth/[...nextauth]/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

 

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Sessions/seats/${id}`,
      {
        
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      
      }
    );

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to edit session" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error editing session", error);
    return NextResponse.json(
      { error: "An error occurred while editing session" },
      { status: 500 }
    );
  }
}