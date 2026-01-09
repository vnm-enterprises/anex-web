import { z } from "zod";

export const AuthSchema = z.object({
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url().optional(),
    })
    .nullable(),
});

export type AuthState = z.infer<typeof AuthSchema>;
