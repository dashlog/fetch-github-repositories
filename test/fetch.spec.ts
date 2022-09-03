// Import Third-party Dependencies
import { expect } from "chai";

// Import Internal Dependencies
import { fetch, fetchLazy } from "../src/index.js";

describe("fetchLazy", () => {
  it("should throw an TypeError if namespace is not a string", async() => {
    try {
      await fetchLazy(null as any);
      expect(1).to.equal(0);
    }
    catch (error) {
      expect(error).to.be.an("TypeError");
    }
  })
});

describe("fetch", () => {
  it("should fetch 'fraxken' github repositories", async() => {
    const repos = await fetch("fraxken");
    expect(Array.isArray(repos)).to.equal(true);
  });
});
