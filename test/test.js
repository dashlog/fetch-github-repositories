"use strict";

// Require Internal Dependencies
const fetchGithubRepositories = require("../");

// Require Third-party Dependencies
const is = require("@slimio/is");

test("fetch 'fraxken' github repositories", async() => {
    const repos = await fetchGithubRepositories("fraxken");
    expect(is.array(repos)).toStrictEqual(true);
});
