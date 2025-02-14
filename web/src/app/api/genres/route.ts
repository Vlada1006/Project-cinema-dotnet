import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function GET(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  try {
    const genresApiResponse = await fetch(`https://localhost:7000/Api/Genres`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!genresApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch genres data" },
        { status: genresApiResponse.status }
      );
    }

    const genresApiResponseBody = await genresApiResponse.json();

    return NextResponse.json(genresApiResponseBody);
  } catch (error) {
    console.error("Error fetching genres data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching genres data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const payload = await req.json();

  try {
    const genresApiResponse = await fetch(`https://localhost:7000/Api/Genres`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(genresApiResponse);

    if (!genresApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new genre" },
        { status: genresApiResponse.status }
      );
    }

    const genresApiResponseBody = await genresApiResponse.json();

    return NextResponse.json(genresApiResponseBody);
  } catch (error) {
    console.error("Error saving new genre:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new genre" },
      { status: 500 }
    );
  }
}
