const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { graphql } = require('@octokit/graphql')
const config = require('../shapeup.config')
require('dotenv').config({
  path: resolve(process.cwd(), '.env.local')
})

async function start () {
  try {
    const data = await graphql(`
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
                      timelineItems(last: 100) {
                        nodes {
                          ... on ClosedEvent {
                            url
                            actor {
                              avatarUrl(size: 100)
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
        owner: config.owner,
        projectNumber: config.projectNumber,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    )

    const projectData = data.user.projectV2.items.edges
    const cycles = []
    const issues = projectData.map(item => {
      let cycleNode = item.node.fieldValues.edges.find(fv => fv.node.field?.name === 'Cycle')?.node
      if (!cycles.find(cycle => cycle.id === cycleNode.iterationId)) {
        const startDate = new Date(cycleNode.startDate)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + cycleNode.duration)
        cycleNode.endDate = endDate
        cycleNode.startDate = startDate.toISOString()
        cycleNode.id = cycleNode.iterationId
        delete cycleNode.iterationId
        cycles.push(cycleNode)
      } else {
        cycleNode = cycles.find(cycle => cycle.id === cycleNode.iterationId)
      }

      return {
        title: item.node.content.title,
        url: item.node.content.url,
        number: item.node.content.number,
        closed: item.node.content.closed,
        closedAt: item.node.content.closedAt,
        author: item.node.content.author,
        bet: item.node.fieldValues.edges.find(fv => fv.node.field?.name === 'Bet')?.node.text,
        kind: item.node.fieldValues.edges.find(fv => fv.node.field?.name === 'Kind')?.node.name,
        appetite: item.node.fieldValues.edges.find(fv => fv.node.field?.name === 'Appetite')?.node.name,
        cycle: cycleNode.id,
        progress: {
          issue_number: item.node.content.number,
          percentage: item.node.content.closed === true ? 100 : getCurrentPercentage(item.node.content.comments.edges.map(edge => edge.node.bodyText)),
          history: getHistory(item.node.content),
        }
      }
    })
    
    const pitches = issues.filter(issue => issue.kind === 'Pitch')
    const bets = issues.filter(issue => issue.kind === 'Bet')
    const scopes = issues.filter(issue => issue.kind === 'Scope')

    const result = {
      cycles,
      pitches,
      bets,
      scopes,
    }

    writeFileSync(resolve(__dirname, '..', 'data.json'), JSON.stringify(result, null, '  '))
  } catch (e) {
    console.error(e)
  }
}

function getCurrentPercentage(comments) {
  const reversedComments = comments.reverse()
  let percentage
  let i = 0

  do {
    percentage = getPercentage(reversedComments[i])
    i++
  } while (percentage === null && i < reversedComments.length)

  return percentage === null ? 0 : percentage
}

function getPercentage(comment = '') {
  const matches = comment.match(/^\/progress[\s]+([\d]+)/)
  if (matches && matches.length === 2) {
    let result = Number(matches[1])
    if (Number.isNaN(result)) return null
    if (result < 0) return 0
    if (result > 100) return 100
    return result
  }
  return null
}

function getStatus(comment = '') {
  const matches = comment.match(/^\/progress[\s]+[\d\n]+(.*)/s)
  if (matches && matches.length === 2) return matches[1]
  return null
}

function getHistory(scope) {
  const historyPoints = scope.comments.edges.map(edge => getHistoryPoint(edge.node)).filter(Boolean)
  if (scope.closed) {
    const closedEvent = scope.timelineItems.nodes.find(node => node.actor)
    historyPoints.push({
      percentage: 100,
      status: null,
      statusMarkdown: null,
      createdAt: scope.closedAt,
      updatedAt: scope.closedAt,
      author: closedEvent.actor,
      url: closedEvent.url,
    })
  }

  return historyPoints.reverse()
}

function getHistoryPoint(commentObject) {
  if (!commentObject.bodyText.match(/^\/progress[\s]+/)) return

  return {
    percentage: getPercentage(commentObject.bodyText),
    status: getStatus(commentObject.bodyText),
    statusMarkdown: getStatus(commentObject.body),
    createdAt: commentObject.createdAt,
    updatedAt: commentObject.updatedAt,
    author: commentObject.author,
    url: commentObject.url,
  }
}

start()