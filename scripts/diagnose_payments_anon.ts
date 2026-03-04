import { createClient } from "@supabase/supabase-js";

// Hardcoded from .env if needed, but let's try reading from env first
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yxxlgucwhstgexncksnp.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_0g9DKaRzEPgMGCe_0VWa5Q_UODGeAbi";

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log("--- Diagnosing payments table via ANON KEY ---");

  const columnsToTest = [
    "id",
    "user_id",
    "listing_id",
    "lemonsqueezy_order_id",
    "amount",
    "status",
    "payment_type",
    "variant_id",
    "created_at",
  ];

  const results = {};

  for (const col of columnsToTest) {
    try {
      const { error } = await supabase.from("payments").select(col).limit(0);
      if (error) {
        results[col] = "MISSING/ERROR: " + error.message;
      } else {
        results[col] = "EXISTS";
      }
    } catch (e) {
      results[col] = "CRASH: " + e.message;
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

diagnose();
