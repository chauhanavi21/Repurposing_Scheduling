import { z } from "zod";

// Single source of truth for environment variables. Add new vars here (and to
// .env.example) as each milestone needs them; nothing else should read
// process.env directly.
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof schema>;

export class EnvValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid environment variables:\n${issues.join("\n")}`);
    this.name = "EnvValidationError";
  }
}

// Reports variable names and problems only, never values, so secrets cannot
// leak into logs.
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new EnvValidationError(
      result.error.issues.map(
        (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
      ),
    );
  }
  return result.data;
}

export const env = parseEnv({
  NODE_ENV: process.env.NODE_ENV,
  // Referenced statically so Next.js can inline it into client bundles.
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
