import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let csvContent = "";
    let fileName = "";

    if (type === "listings") {
      const { data: listings } = await supabase
        .from("listings")
        .select("*, profiles(full_name, email), districts(name), cities(name)");

      if (!listings || listings.length === 0) {
        return NextResponse.json(
          { error: "No listings found" },
          { status: 404 },
        );
      }

      const headers = [
        "ID",
        "Title",
        "Property Type",
        "Price",
        "Status",
        "Payment Status",
        "User Name",
        "User Email",
        "District",
        "City",
        "Created At",
      ];
      csvContent = headers.join(",") + "\n";

      listings.forEach((listing: any) => {
        const row = [
          listing.id,
          `"${listing.title.replace(/"/g, '""')}"`,
          listing.property_type,
          listing.price,
          listing.status,
          listing.payment_status,
          `"${listing.profiles?.full_name?.replace(/"/g, '""') || ""}"`,
          listing.profiles?.email || "",
          listing.districts?.name || "",
          listing.cities?.name || listing.custom_city || "",
          listing.created_at,
        ];
        csvContent += row.join(",") + "\n";
      });
      fileName = "listings_report.csv";
    } else if (type === "payments") {
      const { data: payments } = await supabase
        .from("payments")
        .select("*, profiles(full_name, email), listings(title)");

      if (!payments || payments.length === 0) {
        return NextResponse.json(
          { error: "No payments found" },
          { status: 404 },
        );
      }

      const headers = [
        "ID",
        "Order ID",
        "User Name",
        "User Email",
        "Amount",
        "Status",
        "Type",
        "Listing Title",
        "Created At",
      ];
      csvContent = headers.join(",") + "\n";

      payments.forEach((payment: any) => {
        const row = [
          payment.id,
          payment.lemon_squeezy_order_id,
          `"${payment.profiles?.full_name?.replace(/"/g, '""') || ""}"`,
          payment.profiles?.email || "",
          payment.amount,
          payment.status,
          payment.payment_type,
          `"${payment.listings?.title?.replace(/"/g, '""') || ""}"`,
          payment.created_at,
        ];
        csvContent += row.join(",") + "\n";
      });
      fileName = "payments_report.csv";
    } else {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 },
      );
    }

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Report Export error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
