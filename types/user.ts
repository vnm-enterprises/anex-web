import { ID, Timestamp } from "./common";
import { Role } from "./auth";

export type User = Timestamp & {
  id: ID;
  email: string;
  emailVerified: boolean;
  name?: string | null;
  avatar?: string | null;
  role: Role;
};
