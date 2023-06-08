import { graphql } from "@octokit/graphql"

export default async function fetchCycleData(owner, projectNumber, accessToken) {
  return graphql(`
    query($owner: String!, $projectNumber: Int!) {
      user(login: $owner) {
        projectV2(number: $projectNumber) {
          items(first: 100) {
            edges {
              node {
                content {
                  ...on Issue {
                    title
                    url
                    number
                    closed
                    closedAt
                    createdAt
                    author {
                      login
                      avatarUrl
                    }
                    comments(last: 100) {
                      edges {
                        node {
                          body
                          bodyText
                          createdAt
                          updatedAt
                          url
                          author {
                            avatarUrl(size: 100)
                            ... on User {
                              name
                              url
                            }
                          }
                        }
                      }
                    }
                    timelineItems(
                      last: 100,
                      itemTypes: CLOSED_EVENT
                    ) {
                      nodes {
                        ... on ClosedEvent {
                          url
                          stateReason
                          actor {
                            avatarUrl(size: 100)
                            ... on Actor {
                              login
                              url
                            }
                            ... on Bot {
                              login
                              url
                            }
                            ... on User {
                              name
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                  ...on PullRequest {
                    title
                    url
                    number
                    closed
                    closedAt
                    createdAt
                    author {
                      login
                      avatarUrl
                    }
                    comments(last: 100) {
                      edges {
                        node {
                          body
                          bodyText
                          createdAt
                          updatedAt
                          url
                          author {
                            avatarUrl(size: 100)
                            ... on User {
                              name
                              url
                            }
                          }
                        }
                      }
                    }
                    timelineItems(
                      last: 100,
                      itemTypes: CLOSED_EVENT
                    ) {
                      nodes {
                        ... on ClosedEvent {
                          __typename
                          url
                          stateReason
                          actor {
                            avatarUrl(size: 100)
                            ... on Actor {
                              login
                              url
                            }
                            ... on Bot {
                              login
                              url
                            }
                            ... on User {
                              name
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
                fieldValues(first: 100) {
                  edges {
                    node {
                      ...on ProjectV2ItemFieldNumberValue {
                        field {
                          ...on ProjectV2Field {
                            name
                          }
                        }
                        number
                      }
                      ...on ProjectV2ItemFieldSingleSelectValue {
                        field {
                          ...on ProjectV2SingleSelectField {
                            name
                          }
                        }
                        name
                      }
                      ...on ProjectV2ItemFieldTextValue {
                        field {
                          ...on ProjectV2Field {
                            name
                          }
                        }
                        text
                      }
                      ...on ProjectV2ItemFieldIterationValue {
                        field {
                          ...on ProjectV2IterationField {
                            name
                          }
                        }
                        iterationId
                        title
                        startDate
                        duration
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      owner,
      projectNumber,
      headers: {
        authorization: `token ${accessToken}`,
      },
    }
  )
}
