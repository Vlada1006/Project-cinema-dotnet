import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function GET(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  try {
    const sessionsApiResponse = await fetch(
      `https://localhost:7000/Api/Rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!sessionsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch rooms data" },
        { status: sessionsApiResponse.status }
      );
    }

    const sessionsApiResponseBody = await sessionsApiResponse.json();

    return NextResponse.json(sessionsApiResponseBody);
  } catch (error) {
    console.error("Error fetching rooms data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rooms data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const payload = await req.json();

  try {
    const filmsApiResponse = await fetch(`https://localhost:7000/Api/Rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new room" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error saving new room:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new room" },
      { status: 500 }
    );
  }
}
