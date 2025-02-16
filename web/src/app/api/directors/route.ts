import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function GET(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  try {
    const directorsApiResponse = await fetch(`https://localhost:7000/Api/Directors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!directorsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch directors data" },
        { status: directorsApiResponse.status }
      );
    }

    const directorsApiResponseBody = await directorsApiResponse.json();

    return NextResponse.json(directorsApiResponseBody);
  } catch (error) {
    console.error("Error fetching directors data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching directors data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const payload = await req.json();

  try {
    const directorsApiResponse = await fetch(`https://localhost:7000/Api/Directors`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(directorsApiResponse);

    if (!directorsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new director" },
        { status: directorsApiResponse.status }
      );
    }

    const directorsApiResponseBody = await directorsApiResponse.json();

    return NextResponse.json(directorsApiResponseBody);
  } catch (error) {
    console.error("Error saving new director:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new director" },
      { status: 500 }
    );
  }
}