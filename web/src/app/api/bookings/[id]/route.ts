import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/constants";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { token } = (await getServerSession(authOptions)) as any;
  
    const { id } = await params;
  
    try {
      const bookingsApiResponse = await fetch(
        `https://localhost:7000/Api/Bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!bookingsApiResponse.ok) {
        return NextResponse.json(
          { error: "Failed to delete booking data" },
          { status: bookingsApiResponse.status }
        );
      }
  
      const bookingsApiResponseBody = await bookingsApiResponse.json();
  
      return NextResponse.json(bookingsApiResponseBody);
    } catch (error) {
      console.error("Error deleting booking data:", error);
      return NextResponse.json(
        { error: "An error occurred while deleting booking data" },
        { status: 500 }
      );
    }
  }