import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

type ActionPayload =
  | { type: "generateCode"; userId: string; fullName: string }
  | {
      type: "updateWithdrawalStatus";
      requestId: string;
      status: "processing" | "deposited" | "rejected";
    };

function generateCode(fullName: string) {
  return (
    fullName.split(" ")[0].toUpperCase() +
    Math.floor(1000 + Math.random() * 9000)
  ).replace(/[^A-Z0-9]/g, "");
}

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401, message: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }

  return { ok: true as const, userId: user.id };
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await assertAdmin();
    if (!authCheck.ok) {
      return NextResponse.json(
        { error: authCheck.message },
        { status: authCheck.status },
      );
    }

    const payload = (await request.json()) as ActionPayload;
    const admin = createAdminClient();

    if (payload.type === "generateCode") {
      const code = generateCode(payload.fullName);
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 12);

      const { error: insertError } = await admin.from("affiliate_user").insert({
        user_id: payload.userId,
        ref_code: code,
        expires_at: expiresAt.toISOString(),
        total_users_brought_in: 0,
        qualified_purchases: 0,
        amount_receivable: 0,
      });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, code });
    }

    if (payload.type === "updateWithdrawalStatus") {
      const updateData: Record<string, unknown> = {
        status: payload.status,
        updated_at: new Date().toISOString(),
      };

      if (payload.status === "deposited") {
        updateData.processed_at = new Date().toISOString();
        updateData.processed_by = authCheck.userId;
      }

      const { error: updateError } = await admin
        .from("affiliate_withdrawal_requests")
        .update(updateData)
        .eq("id", payload.requestId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
