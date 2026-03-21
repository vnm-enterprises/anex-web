export type PropertyType = "annex" | "boarding" | "house" | "apartment";
export type FurnishedStatus = "furnished" | "semi-furnished" | "unfurnished";
export type GenderPreference = "male" | "female" | "any" | "families";
export type ListingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "pending_payment";
export type UserRole = "user" | "admin";

export interface District {
  id: string;
  name: string;
  slug: string;
}

export interface City {
  id: string;
  district_id: string;
  name: string;
  slug: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  referred_by?: string | null;
  referred_by_code?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  listing_limit: number;
  free_boosts: number;
  featured_eligible: boolean;
  analytics_access: boolean;
  description: string | null;
  is_active: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  slug: string;
  property_type: PropertyType;
  price: number;
  district_id: string;
  city_id: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  furnished: FurnishedStatus;
  gender_preference: GenderPreference;
  contact_name: string | null;
  contact_phone: string;
  contact_email: string | null;
  status: ListingStatus;
  is_boosted: boolean;
  boost_expires_at: string | null;
  boost_weight: number;
  boost_type: "quick" | "premium" | "featured" | null;
  is_featured: boolean;
  featured_expires_at: string | null;
  featured_weight: number;
  views_count: number;
  inquiries_count: number;
  payment_status: "free" | "unpaid" | "paid" | "refunded";
  expires_at: string;
  custom_city?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  districts?: District;
  cities?: City;
  listing_images?: ListingImage[];
  listing_amenities?: { amenities: Amenity }[];
  profiles?: Profile;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  storage_path: string;
  display_order: number;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  listings?: Listing;
}

export interface SearchParams {
  q?: string;
  district?: string;
  city?: string;
  type?: PropertyType;
  minPrice?: string;
  maxPrice?: string;
  furnished?: FurnishedStatus;
  gender?: GenderPreference;
  amenities?: string[];
  sort?: "newest" | "price_asc" | "price_desc" | "views" | "featured";
  page?: string;
}

export type DesktopNavigationType = {
  pathname: string;
  user: Profile | null;
  setIsProfileModalOpen: () => void;
}

/**
 * Returns the active boost tier for a listing, or null if no boost is currently active.
 * Uses boost_weight + expiry check for correctness; falls back to is_featured flag.
 */
export function getActiveBoostTier(
  listing: Pick<Listing, "boost_weight" | "boost_expires_at" | "boost_type">,
): "quick" | "premium" | "featured" | null {
  const now = new Date();

  const boostLive =
    listing.boost_weight > 0 &&
    (!listing.boost_expires_at || new Date(listing.boost_expires_at) > now);

  if (!boostLive) return null;

  // Prefer explicit tier when available, then safely fall back to weight.
  if (listing.boost_type) return listing.boost_type;
  if (listing.boost_weight >= 3) return "featured";
  if (listing.boost_weight === 2) return "premium";
  if (listing.boost_weight === 1) return "quick";
  return null;
}