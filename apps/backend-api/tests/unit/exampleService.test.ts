import { describe, it, expect } from "@jest/globals";

describe("example business logic", () => {
  const add = (a: number, b: number) => a + b;

  it("adds numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(add(-1, 2)).toBe(1);
  });
});

