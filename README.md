# fetch-github-repositories
Fetch github repositories for a given user (or an organization).

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Why ?

- Fast with a http lib close to the Node.js core.
- Replacement for [repos](https://github.com/jonschlinkert/repos) which introduce dozen of dependencies just for a GET request...
- Come with a TypeScript definition for intellisense.

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
