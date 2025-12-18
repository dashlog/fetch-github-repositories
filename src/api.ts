// Import Third-party Dependencies
import { request } from "undici";
import linkHeader from "http-link-header";
import combineAsyncIterators from "combine-async-iterators";

// Import Internal Dependencies
import type {
  Repository,
  UserOrg
} from "./github.types.ts";

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

  let currURL: string | null = `${kind}/${namespace}/repos`;
  while (currURL) {
    const { body, headers: currHeaders } = await request(
      new URL(currURL, kGithubURL),
      { headers }
    );
    yield* (await body.json() as Repository[]);

    currURL = getNextPageUrl(currHeaders);
  }

  if (kind === "users" && fetchUserOrgs) {
    const { body } = await request(
      new URL(`users/${namespace}/orgs`, kGithubURL),
      { headers }
    );
    const data = await body.json() as UserOrg[];

    const iterators = data.map(
      (row) => fetchLazy(row.login, { agent, token, kind: "orgs" })
    );
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

function getNextPageUrl(
  headers: Record<string, string | string[] | undefined>
): string | null {
  const linkValue = headers.link;
  if (linkValue === undefined) {
    return null;
  }

  const { refs } = linkHeader.parse(linkValue.toString());

  return refs.find(
    (row) => row.rel === "next" || row.rel === "last"
  )?.uri ?? null;
}
