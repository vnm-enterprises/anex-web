import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscriptions")
      .upsert({ email }, { onConflict: "email" });

    if (error) {
      console.error("Newsletter Subscription Error:", error);
      // If table doesn't exist, we might get an error.
      // In a real scenario, we'd ensure the table exists.
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
