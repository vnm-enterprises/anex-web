import { ID, Timestamp } from "./common";
import { User } from "./user";

export type Landlord = Timestamp & {
  id: ID;
  userId: ID;
  isVerified: boolean;
  phone?: string | null;
  idCardFront?: string | null;
  idCardBack?: string | null;

  // Optional populated relations
  user?: User;
};
