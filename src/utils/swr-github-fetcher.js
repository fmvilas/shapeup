import { graphql } from "@octokit/graphql"

export default async function fetcher([query, details]) {
  console.log(query)
  console.log(details)
  return await graphql(query, details)
}
