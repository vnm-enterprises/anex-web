import { ID } from "./common";
import { Property } from "./propertys";

export type SavedListing = {
  id: ID;
  userId: ID;
  propertyId: ID;
  savedAt: string;

  // Optional
  property?: Property;
};
