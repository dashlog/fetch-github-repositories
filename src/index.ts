// Import Third-party Dependencies
import * as httpie from "@myunisoft/httpie";
import linkHeader from "http-link-header";
import combineAsyncIterators from "combine-async-iterators";

// Import Internal Dependencies
export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: "User" | "Organization";
      site_admin: boolean;
  };
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: null | string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
      key: string;
      name: string;
      spdx_id: string;
      url: string;
      node_id: string;
  } | null;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions?: {
      admin: true;
      push: true;
      pull: true;
  }
}

interface UserOrg {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string;
}

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
