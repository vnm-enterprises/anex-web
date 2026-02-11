import { ID, Timestamp } from "./common";
import { User } from "./user";

export type Rating = Timestamp & {
  id: ID;
  userId: ID;
  propertyId: ID;
  rating: number; // 1–5
  comment?: string | null;

  // Optional populated relations
  user?: User;
};
