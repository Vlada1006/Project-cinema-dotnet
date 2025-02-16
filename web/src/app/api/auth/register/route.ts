import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const response = await fetch("https://localhost:7000/api/Auth/Register", {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password,
        roles: ["User", "Admin"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({}, { status: 409 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    throw e;
  }
}
