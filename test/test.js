"use strict";

// Require Internal Dependencies
const { fetch } = require("../");

// Require Third-party Dependencies
const is = require("@slimio/is");

test("fetch 'fraxken' github repositories", async() => {
    const repos = await fetch("fraxken");
    expect(is.array(repos)).toStrictEqual(true);
});
