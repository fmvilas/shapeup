import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import stringToColor from 'string-to-color'
import nearestColor from 'nearest-color'
import Bet from './Bet'
import Scope from './Scope'
import colors from './colors'
import data from '../data.json'
import Header from './Header'
import Footer from './Footer'
import Cycle from './Cycle'

export default function CyclePage({ visibleCycle, previousCycle, nextCycle, inCycle, availablePitches = [], availableBets = [], availableScopes = [], params }) {
  const router = useRouter()
  const [visibleBet, setVisibleBet] = useState(availableBets[0] || null)
  const visibleScopes = availableScopes.filter(scope => belongsToBet(visibleBet, scope))
  const [selectedScopes, setSelectedScopes] = useState(visibleScopes)

  useEffect(() => {
    if (!params || !params.id) replaceRoute()
  }, [])

  function replaceRoute() {
    router.replace(`/cycles/${visibleCycle.id}`)
  }

  function onBetChange({ issue, toggled }) {
    if (toggled) {
      setVisibleBet(issue)
    }
  }

  function onScopeChange({ issue, toggled }) {
    if (toggled) {
      setSelectedScopes([...selectedScopes, issue])
    } else {
      setSelectedScopes(selectedScopes.filter(sc => sc.url !== issue.url))
    }
  }

  return (
    <>
      <Head>
        <title>AsyncAPI - Shape Up Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-16 px-4 sm:py-16 sm:px-6 lg:px-8">
          <Header />

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div>
              <div className="lg:shadow lg:p-4">
                <div className="pb-5 border-b border-gray-200 space-y-2">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bets
                  </h3>
                  <p className="max-w-4xl text-sm leading-5 text-gray-500">Ideas we're now <strong>committed</strong> to implement during this 6 weeks cycle.</p>
                </div>

                <div>
                  {
                    availableBets.map((bet, index) => (
                      <Bet key={index} issue={bet} toggled={visibleBet && bet.url === visibleBet.url} disabled={availableBets.length === 1} className="mt-3" onChange={onBetChange} />
                    ))
                  }
                  {
                    !visibleBet && (
                      <p className="italic text-sm text-gray-400 mt-4">No bets have been created yet.</p>
                    )
                  }
                </div>

                <div className="mt-8 pb-5 border-b border-gray-200 space-y-2">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Scopes
                  </h3>
                  <p className="max-w-4xl text-sm leading-5 text-gray-500">
                    Scopes are groups of related tasks.
                  </p>
                </div>

                <div>
                  {
                    (visibleScopes || []).map((scope, index) => (
                      <Scope key={index} issue={scope} toggled={!!selectedScopes.find(s => s.url === scope.url)} onChange={onScopeChange} className="mt-3" />
                    ))
                  }
                  {
                    !(visibleScopes || []).length && (
                      <p className="italic text-sm text-gray-400 mt-4">No scopes have been created yet.</p>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Cycle
                visibleCycle={visibleCycle}
                inCycle={inCycle}
                previousCycle={previousCycle}
                nextCycle={nextCycle}
                pitches={availablePitches}
                bets={availableBets}
                selectedScopes={selectedScopes}
              />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}

export async function getServerSideProps({ params = {} }) {
  const { cycle, inCycle } = getVisibleCycleDetails(params.id)
  if (!cycle) return { notFound: true }
  data.visibleCycle = cycle
  data.inCycle = inCycle
  
  const visibleCycleIndex = data.cycles.findIndex(cycle => cycle.id === data.visibleCycle.id)
  data.previousCycle = visibleCycleIndex > 0 ? data.cycles[visibleCycleIndex - 1] : null
  data.nextCycle = visibleCycleIndex < data.cycles.length - 1 ? data.cycles[visibleCycleIndex + 1] : null

  data.availablePitches = data.pitches.filter(p => p.cycle === data.visibleCycle.id)
  data.availableBets = data.bets.filter(b => b.cycle === data.visibleCycle.id)

  data.availableScopes = data.scopes.map(scope => {
    scope.color = nearestColor.from(colors)(stringToColor(scope.url.replace('https://github.com/', '')))
    return scope
  })

  return {
    props: {
      ...data,
      params,
    },
  }
}

function getVisibleCycleDetails(id) {
  let inCycle = false
  let cycle

  if (id) {
    cycle = data.cycles.find(cycle => String(cycle.id) === id)
    if (cycle) {
      const startDate = new Date(cycle.startDate)
      const endDate = new Date(cycle.endDate)
      const now = new Date()
      inCycle = (startDate <= now && endDate >= now)
    }
  } else {
    cycle = data.cycles.find(c => {
      const startDate = new Date(c.startDate)
      const endDate = new Date(c.endDate)
      const now = new Date()
      if (endDate < now) return false
      if (startDate <= now && endDate >= now) inCycle = true
      return c
    })
  }

  return {
    cycle,
    inCycle,
  }
}

function belongsToBet(bet, scope) {
  if (!bet || !scope) return false
  return scope.bet === bet.url
}
