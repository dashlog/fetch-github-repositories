// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import Internal Dependencies
import { fetch } from "../src/index.js";

describe("fetch", () => {
  it("should fetch 'fraxken' github repositories", async() => {
    const repos = await fetch("fraxken");
    assert.ok(Array.isArray(repos));
  });
});
