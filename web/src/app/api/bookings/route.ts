import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/constants";

export async function POST(req: NextRequest) {
  const { token } = (await getServerSession(authOptions)) as any;

  const payload = await req.json();

  try {
    const bookingApiResponse = await fetch(`https://localhost:7000/Api/Bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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


export async function GET(req: NextRequest) {

  const { token } = (await getServerSession(authOptions)) as any;

  try {
    
    const bookingApiResponse = await fetch(`https://localhost:7000/Api/Bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );

    if (!bookingApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch booking data" },
        { status: bookingApiResponse.status }
      );
    }

    const bookingApiResponseBody = await bookingApiResponse.json();

    return NextResponse.json(bookingApiResponseBody);
  } catch (error) {
    console.error("Error fetching booking data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching booking data" },
      { status: 500 }
    );
  }
}
