import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      property_type,
      price,
      district_id,
      city_id,
      area,
      latitude,
      longitude,
      furnished,
      gender_preference,
      contact_name,
      contact_phone,
      contact_email,
      amenity_ids,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !property_type ||
      !price ||
      !district_id ||
      !city_id ||
      !contact_phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate unique slug
    let slug = slugify(title);
    let counter = 0;
    let isUnique = false;

    while (!isUnique) {
      const { data: existing } = await supabase
        .from("listings")
        .select("id")
        .eq("slug", counter === 0 ? slug : `${slug}-${counter}`)
        .single();

      if (!existing) {
        if (counter > 0) slug = `${slug}-${counter}`;
        isUnique = true;
      }
      counter++;
    }

    // Create listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title,
        description,
        slug,
        property_type,
        price,
        district_id,
        city_id,
        area,
        latitude,
        longitude,
        furnished: furnished || "unfurnished",
        gender_preference: gender_preference || "any",
        contact_name,
        contact_phone,
        contact_email,
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      })
      .select()
      .single();

    if (listingError) {
      return NextResponse.json(
        { error: listingError.message },
        { status: 500 },
      );
    }

    // Add amenities if provided
    if (amenity_ids && amenity_ids.length > 0) {
      const amenityRecords = amenity_ids.map((id: string) => ({
        listing_id: listing.id,
        amenity_id: id,
      }));

      const { error: amenityError } = await supabase
        .from("listing_amenities")
        .insert(amenityRecords);

      if (amenityError) {
        console.error("Error adding amenities:", amenityError);
      }
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Listings POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
