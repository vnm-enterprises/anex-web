import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log("--- Diagnosing payments table ---");

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
