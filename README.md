# fetch-github-repositories
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/fraxken/fetch-github-repositories/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/fraxken/fetch-github-repositories/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/fraxken/fetch-github-repositories)
![size](https://img.shields.io/github/languages/code-size/fraxken/fetch-github-repositories)

Fetch github repositories for a given user (or an organization).

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Why ?

- Fast and light.
- Replacement for [repos](https://github.com/jonschlinkert/repos) which introduce dozen of dependencies just for a GET request...
- Come with a bundled TypeScript definition for intellisense.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i fetch-github-repositories
# or
$ yarn add fetch-github-repositories
```

## Usage example
```js
const fetchGithubRepositories = require("fetch-github-repositories");

async function main() {
    const options = { agent: "my-program" };
    const repos = await fetchGithubRepositories("userName", options);
    // Do the job with repos
}
main().catch(console.error);
```

## API

### fetchGithubRepositories(user: string, options?: Options): Repository[]
Return an Array of repositories (the interface can be found in index.d.ts).

Options:

| name | default value | description |
| --- | --- | --- |
| agent | "fetch-github-repo" | User-Agent header (required by github) |
| token | undefined | github token for private repositories |

## License
MIT
