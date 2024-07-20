# Fetch-github-repositories
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/dashlog/fetch-github-repositories/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/dashlog/fetch-github-repositories/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/dashlog/fetch-github-repositories)
![size](https://img.shields.io/github/languages/code-size/dashlog/fetch-github-repositories)

Fetch github repositories for a given user (or an organization).

## Requirements
- [Node.js](https://nodejs.org/en/) v20 or higher

## Why ?

- Fast and light (With a lazy API if required).
- Support both `users` and `orgs` endpoints with the **kind** option.
- Replacement for [repos](https://github.com/jonschlinkert/repos) which introduce dozen of dependencies.
- TypeScript support.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @dashlog/fetch-github-repositories
# or
$ yarn add @dashlog/fetch-github-repositories
```

## Usage example
```js
import { fetch, fetchLazy } from "@dashlog/fetch-github-repositories";

const repos = await fetch("fraxken", {
    fetchUserOrgs: true // if you want an equivalent of "repos"
});

// or use lazy API
for await (const repo of fetchLazy("fraxken")) {
    console.log(repo.full_name);
}
```

## API

### fetch(namespace: string, options?: FetchOptions): Promise< Repository[] >
Return an Array of repositories (the interface can be found in index.d.ts).

```ts
export interface FetchOptions {
  /**
   * @default fetch-github-repo
   */
  agent?: string;
  token?: string | null;
  /**
   * @default users
   */
  kind?: "users" | "orgs";
  /**
   * Fetch the repositories of all orgs for a given user
   * @default false
   */
  fetchUserOrgs?: boolean;
}
```

### fetchLazy(namespace: string, options?: FetchOptions): AsyncIterableIterator< Repository >
Same arguments as **fetch**.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/thomas-gentilhomme/"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gentilhomme</b></sub></a><br /><a href="https://github.com/dashlog/fetch-github-repositories/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/dashlog/fetch-github-repositories/issues?q=author%3Afraxken" title="Bug reports">🐛</a> <a href="https://github.com/dashlog/fetch-github-repositories/commits?author=fraxken" title="Documentation">📖</a> <a href="#security-fraxken" title="Security">🛡️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
MIT
