import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const {amount} = await req.json();

  try {
    const bookingApiResponse = await fetch(`https://localhost:7000/Api/Trasactions?amount=${amount}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      
    });

    if (!bookingApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to save new room" },
        { status: bookingApiResponse.status }
      );
    }

    const filmsApiResponseBody = await bookingApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error saving new room:", error);
    return NextResponse.json(
      { error: "An error occurred while saving new room" },
      { status: 500 }
    );
  }
}
