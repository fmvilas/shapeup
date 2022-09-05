const fs = require('fs')
const json2xml = require('jgexml/json2xml')
const data = require('../data.json')

function clean(s) {
  s = s.split('&ltspan&gt').join('')
  s = s.split('&amp').join('&')
  s = s.split('&#39;').join("'")
  s = s.split('&lt;').join('<')
  s = s.split('&gt;').join('>')
  s = s.split('&quot;').join('"')
  return s
}

const base = 'https://shapeup.franmendez.blog'
const tracking = '?utm_source=rss';

const feed = {}
const rss = {}
rss['@version'] = '2.0'
rss["@xmlns:atom"] = 'http://www.w3.org/2005/Atom'
rss.channel = {}
rss.channel.title = 'Fran Mendez Shape Up RSS Feed'
rss.channel.link = `${base}/rss.xml`
rss.channel["atom:link"] = {}
rss.channel["atom:link"]["@rel"] = 'self'
rss.channel["atom:link"]["@href"] = rss.channel.link
rss.channel["atom:link"]["@type"] = 'application/rss+xml'
rss.channel.description = 'Fran Mendez Shape Up'
rss.channel.language = 'en-gb';
rss.channel.copyright = 'Made with :love: by Fran Mendez.';
rss.channel.webMaster = 'fmvilas@gmail.com (Fran Mendez)'
rss.channel.pubDate = new Date().toUTCString()
rss.channel.generator = 'next.js'
rss.channel.item = []

for (let scope of data.scopes.sort((scope1, scope2) => new Date(scope2.createdAt) - new Date(scope1.createdAt))) {
  const link = `${base}/cycles/${scope.cycle}${tracking}`;

  for (let historyItem of scope.progress.history.sort((item1, item2) => new Date(item2.createdAt) - new Date(item1.createdAt))) {
    const item = { title: `${historyItem.percentage}% | ${scope.title}`, description: historyItem.status, link, category: data.bets.find(bet => bet.url === scope.bet).title, guid: { '@isPermaLink': true, '': link }, pubDate: new Date(historyItem.createdAt).toUTCString() }
    rss.channel.item.push(item)
  }

  const item = { title: scope.title, description: 'Scope added', link, category: data.bets.find(bet => bet.url === scope.bet).title, guid: { '@isPermaLink': true, '': link }, pubDate: new Date(scope.createdAt).toUTCString() }
  rss.channel.item.push(item)
}

feed.rss = rss

const xml = json2xml.getXml(feed, '@', '', 2)
fs.writeFileSync(`./public/rss.xml`, xml, 'utf8')

