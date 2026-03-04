import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Checking listings table schema...");
  const { data, error } = await supabase.from("listings").select("*").limit(1);

  if (error) {
    console.error("Error fetching from listings:", error);
  } else {
    console.log("Successfully fetched from listings.");
    if (data && data.length > 0) {
      console.log("Columns in listings:", Object.keys(data[0]));
    } else {
      console.log("No rows in listings table to inspect columns.");
      // Try to get one with select(*) even if empty
      const { data: allData, error: allErr } = await supabase
        .from("listings")
        .select("*")
        .limit(0);
      console.log("Empty select headers:", allData);
    }
  }
}

checkSchema();
