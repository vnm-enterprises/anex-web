import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAdminRole(userId: string, supabase: any) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await checkAdminRole(user.id, supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const status = request.nextUrl.searchParams.get("status");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = 20;

    let query = supabase.from("listings").select(
      `*,
        districts(name),
        cities(name),
        custom_city,
        profiles(full_name, email),
        listing_images(url)`,
      { count: "exact" },
    );

    if (status) {
      query = query.eq("status", status);
    }

    const {
      data: listings,
      count,
      error,
    } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      listings,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error("Admin listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
