import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkPaymentsSchema() {
  const { data, error } = await supabase.from("payments").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(
      "Columns:",
      data.length > 0 ? Object.keys(data[0]) : "No data to check columns",
    );
  }
}

checkPaymentsSchema();
