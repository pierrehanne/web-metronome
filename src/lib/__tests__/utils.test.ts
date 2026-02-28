import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("filters out undefined, null, and empty strings", () => {
    expect(cn(undefined, null, "", "valid")).toBe("valid");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
