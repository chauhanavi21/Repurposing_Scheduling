import { describe, expect, it } from "vitest";

import { EnvValidationError, parseEnv } from "./env";

describe("parseEnv", () => {
  it("applies defaults when optional vars are missing", () => {
    expect(parseEnv({})).toEqual({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("accepts valid values", () => {
    const env = parseEnv({
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://repostr.example",
    });
    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://repostr.example");
    expect(env.NODE_ENV).toBe("production");
  });

  it("rejects invalid values and names the offending variable", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "not a url" })).toThrow(
      EnvValidationError,
    );
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_APP_URL/,
    );
  });

  it("does not echo the invalid value in the error message", () => {
    const secretish = "sk_live_should_never_be_logged";
    try {
      parseEnv({ NODE_ENV: secretish });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).not.toContain(secretish);
    }
  });
});
