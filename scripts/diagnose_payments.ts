import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log("--- Fetching one row from payments to inspect columns ---");
  // Try to find ANY record to see what columns come back
  const { data, error } = await supabase.from("payments").select("*").limit(1);

  if (error) {
    console.error("Error fetching payments:", error);
    if (error.message.includes("column")) {
      console.log("Likely a missing column error!");
    }
  } else {
    console.log(
      "Payments columns detected:",
      data && data.length > 0
        ? Object.keys(data[0])
        : "Table empty, checking via empty select...",
    );

    // Fallback: try to select specific columns to see which ones fail
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
    for (const col of columnsToTest) {
      const { error: colError } = await supabase
        .from("payments")
        .select(col)
        .limit(0);
      if (colError) {
        console.log(`Column [${col}] check FAILED:`, colError.message);
      } else {
        console.log(`Column [${col}] exists.`);
      }
    }
  }
}

diagnose();
