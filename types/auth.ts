import { Role } from "./enums";

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  avatar?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  sessionToken: string;
  expires: string;
};
