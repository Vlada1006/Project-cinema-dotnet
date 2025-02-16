import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/constants";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

  const payload = await req.json();

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Sessions/${id}`,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token } = (await getServerSession(authOptions)) as any;

  const { id } = await params;

  try {
    const filmsApiResponse = await fetch(
      `https://localhost:7000/Api/Sessions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!filmsApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: filmsApiResponse.status }
      );
    }

    const filmsApiResponseBody = await filmsApiResponse.json();

    return NextResponse.json(filmsApiResponseBody);
  } catch (error) {
    console.error("Error deleting session", error);
    return NextResponse.json(
      { error: "An error occurred while deleting session" },
      { status: 500 }
    );
  }
}
