import { createClient } from "@/lib/supabase/server";
import { AdminPaymentsClient } from "./admin-payments-client";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      profiles:user_id (full_name),
      listings:listing_id (title)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-foreground tracking-tighter">
          Payment <span className="text-primary">History</span>
        </h1>
        <p className="mt-2 text-muted-foreground font-medium">
          Monitor all Lemon Squeezy transactions and their status.
        </p>
      </div>

      <AdminPaymentsClient initialPayments={payments || []} />
    </div>
  );
}
