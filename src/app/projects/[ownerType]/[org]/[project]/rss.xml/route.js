import json2xml from 'jgexml/json2xml'
import { prepareData } from '../cycles/[cycle]/page'

export async function GET(_, { params }) {
  const data = await prepareData(params)

  const base = process.env.NEXTAUTH_URL
  const tracking = '?utm_source=rss';

  const feed = {}
  const rss = {}
  rss['@version'] = '2.0'
  rss["@xmlns:atom"] = 'http://www.w3.org/2005/Atom'
  rss.channel = {}
  rss.channel.title = `${data.project.title} Shape It! RSS Feed`
  rss.channel.link = `${base}/projects/${data.project.ownerType}/${data.project.org}/${data.project.number}/rss.xml`
  rss.channel["atom:link"] = {}
  rss.channel["atom:link"]["@rel"] = 'self'
  rss.channel["atom:link"]["@href"] = rss.channel.link
  rss.channel["atom:link"]["@type"] = 'application/rss+xml'
  rss.channel.description = `${data.project.title} Shape It! RSS Feed`
  rss.channel.language = 'en-gb';
  rss.channel.pubDate = new Date().toUTCString()
  rss.channel.generator = 'next.js'
  rss.channel.item = []

  for (let scope of data.scopes.sort((scope1, scope2) => new Date(scope2.createdAt) - new Date(scope1.createdAt))) {
    const link = `${base}/projects/${data.project.ownerType}/${data.project.org}/${data.project.number}/cycles/${scope.cycle}${tracking}`

    for (let historyItem of scope.progress.history.sort((item1, item2) => new Date(item2.createdAt) - new Date(item1.createdAt))) {
      const item = { title: `${historyItem.percentage}% | ${scope.title}`, description: historyItem.status, link, category: data.bets.find(bet => bet.url === scope.bet).title, guid: { '@isPermaLink': true, '': link }, pubDate: new Date(historyItem.createdAt).toUTCString() }
      rss.channel.item.push(item)
    }

    const item = { title: scope.title, description: 'Scope added', link, category: data.bets.find(bet => bet.url === scope.bet).title, guid: { '@isPermaLink': true, '': link }, pubDate: new Date(scope.createdAt).toUTCString() }
    rss.channel.item.push(item)
  }

  for (let bet of data.bets.sort((bet1, bet2) => new Date(bet2.createdAt) - new Date(bet1.createdAt))) {
    const link = `${base}/projects/${data.project.ownerType}/${data.project.org}/${data.project.number}/cycles/${bet.cycle}${tracking}`
    const item = { title: bet.title, description: 'Bet added', link, category: bet.title, guid: { '@isPermaLink': true, '': link }, pubDate: new Date(bet.createdAt).toUTCString() }
    rss.channel.item.push(item)
  }

  feed.rss = rss

  const xml = json2xml.getXml(feed, '@', '', 2)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8'
    }
  })
}