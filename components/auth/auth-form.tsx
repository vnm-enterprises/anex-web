"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

/** Declarative field model for auth forms. */
export interface AuthFormField {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
}

interface AuthFormProps {
  title: string;
  description: string;
  fields: AuthFormField[];
  isLoading: boolean;
  submitLabel: string;
  loadingLabel: string;
  error?: string | null;
  success?: string | null;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  preSubmitContent?: React.ReactNode;
  postSubmitContent?: React.ReactNode;
}

/**
 * Generic auth form component used by login, signup, and password flows.
 */
export function AuthForm({
  title,
  description,
  fields,
  isLoading,
  submitLabel,
  loadingLabel,
  error,
  success,
  onSubmit,
  preSubmitContent,
  postSubmitContent,
}: AuthFormProps) {
  return (
    <div className="max-w-md w-full mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>

      <form onSubmit={onSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            <Label>{field.label}</Label>
            <Input
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required={field.required}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="mt-2"
              autoComplete={field.autoComplete}
            />
          </div>
        ))}

        {preSubmitContent}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>

        {postSubmitContent}
      </form>
    </div>
  );
}
