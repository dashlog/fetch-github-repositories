"use strict";

// Require Third-party Dependencies
const { get } = require("httpie");
const linkHeader = require("http-link-header");
const combineAsyncIterators = require("combine-async-iterators");

// CONSTANTS
const GITHUB_URL = new URL("https://api.github.com/");

async function* fetchLazy(user, options = Object.create(null)) {
    if (typeof user !== "string") {
        throw new TypeError("user argument must be typeof string");
    }
    const {
        agent = "fetch-github-repo",
        token = null,
        kind = "users",
        fetchUserOrgs = false
    } = options;

    // Create headers
    const headers = {
        "User-Agent": agent,
        Accept: "application/vnd.github.v3.raw"
    };
    if (typeof token === "string") {
        headers.Authorization = `token ${token}`;
    }

    // TODO: parse link & lazy fetch all pages at once ?
    let currURL = `${kind}/${user}/repos`;
    while (1) {
        const { data = null, headers: currHeaders } = await get(new URL(currURL, GITHUB_URL), { headers });
        for (const repo of data) {
            yield repo;
        }

        if (!Reflect.has(currHeaders, "link")) {
            break;
        }
        const { refs } = linkHeader.parse(currHeaders.link);

        const item = refs.find((row) => row.rel === "next" || row.rel === "last");
        if (item === undefined) {
            break;
        }
        currURL = item.uri;
    }

    if (kind === "users" && fetchUserOrgs) {
        const { data } = await get(new URL(`users/${user}/orgs`, GITHUB_URL), { headers });

        const iterators = data.map((row) => fetchLazy(row.login, { agent, token, kind: "orgs" }));
        for await (const repo of combineAsyncIterators(...iterators)) {
            yield repo;
        }
    }
}

async function fetch(user, options = Object.create(null)) {
    const repositories = [];
    for await (const repo of fetchLazy(user, options)) {
        repositories.push(repo);
    }

    return repositories;
}

module.exports = {
    fetch,
    fetchLazy
};
