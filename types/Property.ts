export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;

  latitude: number | null;
  longitude: number | null;

  price: number;
  keymoney: number;

  propertyType: "ANNEX" | "APARTMENT" | "ROOM";
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;

  propertyImages: string[];
  surroundingImages: string[];

  amenities: { id: string; name: string }[];

  isVerified: boolean;
  isBoosted: boolean;
  isFeatured: boolean;
  isActive: boolean;

  createdAt: string;

  landlord: {
    name: string;
    avatar: string | null;
  };
}
