import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/server/logger";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export function withErrorBoundary(handler: () => Promise<Response>) {
  return handler().catch((error: unknown) => {
    if (error instanceof HttpError) {
      return fail(error.status, error.message);
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
    }

    logger.error({ error }, "Unhandled route error");
    return fail(500, "Internal server error");
  });
}
