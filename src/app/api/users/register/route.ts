import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/api/users";
import { isEduEmail } from "@/lib/utils/verification";

export async function POST(req: NextRequest) {
  try {
    const { auth_id, email, major } = await req.json();

    // Check if email is a .edu email
    const is_verified = isEduEmail(email);

    const userRow = await createUser({ 
      auth_id, 
      email, 
      is_verified,
      major: major || null,
    });

    return NextResponse.json({ user: userRow });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
