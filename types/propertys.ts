import { ID, Timestamp } from "./common";
import { Landlord } from "./landlord";

/* ---------------- ENUMS ---------------- */

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  CONDO = "CONDO",
  VILLA = "VILLA",
  TOWNHOUSE = "TOWNHOUSE",
  STUDIO = "STUDIO",
}

/* ---------------- AMENITY ---------------- */

export type Amenity = {
  id: ID;
  name: string;
};

/* ---------------- PROPERTY VIEW ---------------- */

export type PropertyView = {
  id: ID;
  propertyId: ID;
  userId?: ID | null;
  ip: string;
  viewedAt: string;
};

/* ---------------- PROPERTY ---------------- */

export type Property = Timestamp & {
  id: ID;
  landlordId: ID;

  title: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;

  price: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;

  propertyImages: string[];
  surroundingImages: string[];

  amenities: Amenity[];

  isActive: boolean;

  // Aggregates (usually returned by backend)
  viewsCount?: number;
  averageRating?: number;

  // Relations (optional, API-dependent)
  landlord?: Landlord;
};
