import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function GET(req: NextRequest) {
  try {
    const sessionsApiResponse = await fetch(
      `https://localhost:7000/Api/Sessions`
    );

    if (!sessionsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sessions data" },
        { status: sessionsApiResponse.status }
      );
    }

    const sessionsApiResponseBody = await sessionsApiResponse.json();
    console.log(sessionsApiResponseBody);

    return NextResponse.json(sessionsApiResponseBody);
  } catch (error) {
    console.error("Error fetching sessions data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching sessions data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const payload = await req.json();

  console.log(payload);

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log(filmsApiResponse);
    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new session" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error saving new session:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new session" },
      { status: 500 }
    );
  }
}
