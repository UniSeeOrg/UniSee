import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/api/users";

export async function POST(req: NextRequest) {
  try {
    const { auth_id, email } = await req.json();

    const userRow = await createUser({ auth_id, email });

    return NextResponse.json({ user: userRow });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
