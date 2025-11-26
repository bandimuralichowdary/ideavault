import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // required!
);

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Missing token or password" },
        { status: 400 }
      );
    }

    // Verify access token first — get user
    const { data: userData, error: userErr } =
      await supabaseAdmin.auth.getUser(token);

    if (userErr || !userData?.user?.id) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update password using admin API
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      userData.user.id,
      {
        password: newPassword,
      }
    );

    if (updateErr) {
      return NextResponse.json(
        { message: updateErr.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
