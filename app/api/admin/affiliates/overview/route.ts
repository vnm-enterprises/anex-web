import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = createAdminClient();

    const [{ data: affiliates, error: affiliatesError }, { data: withdrawals, error: withdrawalsError }, { data: users, error: usersError }] =
      await Promise.all([
        admin
          .from("affiliate_user")
          .select("id, user_id, ref_code, expires_at, total_users_brought_in, qualified_purchases, amount_receivable, created_at, updated_at")
          .order("created_at", { ascending: false }),
        admin
          .from("affiliate_withdrawal_requests")
          .select("id, affiliate_user_id, amount_lkr, bank_account_name, bank_name, bank_branch, bank_account_number, notes, status, admin_note, requested_at, processed_at, created_at, updated_at")
          .order("requested_at", { ascending: false }),
        admin
          .from("profiles")
          .select("id, full_name, phone, role")
          .order("full_name"),
      ]);

    if (affiliatesError) {
      return NextResponse.json(
        { error: affiliatesError.message },
        { status: 500 },
      );
    }

    if (withdrawalsError) {
      return NextResponse.json(
        { error: withdrawalsError.message },
        { status: 500 },
      );
    }

    if (usersError) {
      return NextResponse.json(
        { error: usersError.message },
        { status: 500 },
      );
    }

    const profileById = new Map((users ?? []).map((u) => [u.id, u]));

    const enrichedAffiliates = (affiliates ?? []).map((affiliate) => ({
      ...affiliate,
      profiles: profileById.get(affiliate.user_id) ?? null,
    }));

    const affiliateById = new Map(enrichedAffiliates.map((a) => [a.id, a]));

    const enrichedWithdrawals = (withdrawals ?? []).map((requestItem) => ({
      ...requestItem,
      affiliate: affiliateById.get(requestItem.affiliate_user_id) ?? null,
    }));

    const affiliateUserIds = new Set((affiliates ?? []).map((a) => a.user_id));

    const potentialUsers = (users ?? []).filter(
      (u) => u.role === "user" && !affiliateUserIds.has(u.id),
    );

    return NextResponse.json({
      affiliates: enrichedAffiliates,
      withdrawals: enrichedWithdrawals,
      users: potentialUsers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
