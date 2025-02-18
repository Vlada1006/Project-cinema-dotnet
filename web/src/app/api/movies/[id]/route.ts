import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Films/${id}`
    );

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch film data" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error fetching movies data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching movies data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

  const payload = await req.json();

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Films/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Films/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to delete films data" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error deleting movies data:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting movies data" },
      { status: 500 }
    );
  }
}
