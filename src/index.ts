// Import Third-party Dependencies
import * as httpie from "@myunisoft/httpie";
import linkHeader from "http-link-header";
import combineAsyncIterators from "combine-async-iterators";

// Import Internal Dependencies
import { Repository, UserOrg } from "./github";

// CONSTANTS
const kGithubURL = new URL("https://api.github.com/");

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

export async function* fetchLazy(
  namespace: string,
  options: FetchOptions = Object.create(null)
): AsyncIterableIterator<Repository> {
  if (typeof namespace !== "string") {
    throw new TypeError("namespace argument must be typeof string");
  }
  const {
    agent = "fetch-github-repo",
    token = null,
    kind = "users",
    fetchUserOrgs = false
  } = options;

  const headers = {
    "User-Agent": agent,
    Accept: "application/vnd.github.v3.raw",
    ...(typeof token === "string" ? { Authorization: `token ${token}` } : {})
  };

  let currURL = `${kind}/${namespace}/repos`;
  while (1) {
    const { data, headers: currHeaders } = await httpie.get<Repository[]>(new URL(currURL, kGithubURL), { headers });
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
    const { data } = await httpie.get<UserOrg[]>(new URL(`users/${namespace}/orgs`, kGithubURL), { headers });

    const iterators = data.map((row) => fetchLazy(row.login, { agent, token, kind: "orgs" }));
    for await (const repo of combineAsyncIterators(...iterators)) {
      yield repo;
    }
  }
}

export async function fetch(
  namespace: string,
  options: FetchOptions = Object.create(null)
): Promise<Repository[]> {
  const repositories: Repository[] = [];
  for await (const repo of fetchLazy(namespace, options)) {
    repositories.push(repo);
  }

  return repositories;
}

export { Repository };
