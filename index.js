"use strict";

// Require Third-party Dependencies
const { get } = require("httpie");

// CONSTANTS
const GITHUB_URL = new URL("https://api.github.com/users/");

/**
 * @async
 * @function fetchGithubRepositories
 * @param {!string} user user name or organization name
 * @param {object} [options]
 * @param {string} [options.agent="fetch-github-repo"] User-Agent header
 * @param {string} [options.token] OAuth2 github token (for private repositories).
 * @returns {Promise<object>}
 *
 * @throws {TypeError}
 */
async function fetchGithubRepositories(user, options = Object.create(null)) {
    if (typeof user !== "string") {
        throw new TypeError("user argument must be typeof string");
    }
    const { agent = "fetch-github-repo", token = null } = options;

    const headers = {
        "User-Agent": agent,
        Accept: "application/vnd.github.v3.raw"
    };
    if (typeof token === "string") {
        headers.Authorization = `token ${token}`;
    }
    const { data = null } = await get(new URL(`${user}/repos`, GITHUB_URL), { headers });

    return data;
}

module.exports = fetchGithubRepositories;
