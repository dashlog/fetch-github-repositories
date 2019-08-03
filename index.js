"use strict";

// Require Third-party Dependencies
const { get } = require("httpie");

// CONSTANTS
const GITHUB_URL = new URL("https://api.github.com/");

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
    const { agent = "fetch-github-repo", token = null, kind = "users" } = options;

    // Create headers
    const headers = {
        "User-Agent": agent,
        Accept: "application/vnd.github.v3.raw"
    };
    if (typeof token === "string") {
        headers.Authorization = `token ${token}`;
    }

    // Navigate through pages...
    const results = [];
    for (let page = 1; ;page++) {
        // TODO: read headers.link to get the latest page ?
        const { data = null } = await get(
            new URL(`${kind}/${user}/repos?per_page=100&page=${page}`, GITHUB_URL), { headers });

        if (data.length === 0) {
            break;
        }
        results.push(...data);
    }

    return results;
}

module.exports = fetchGithubRepositories;
