import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import stringToColor from 'string-to-color'
import nearestColor from 'nearest-color'
import colors from './colors'
import data from '../data.json'
import Header from './Header'
import Footer from './Footer'
import Cycle from './Cycle'
import CycleSidebar from './CycleSidebar'

export default function CyclePage({ visibleCycle, previousCycle, nextCycle, inCycle, availablePitches = [], availableBets = [], availableScopes = [], params }) {
  const router = useRouter()
  const [visibleBet, setVisibleBet] = useState(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
  const [visibleScopes, setVisibleScopes] = useState(availableScopes.filter(scope => belongsToBet(visibleBet, scope)))
  const [selectedScopes, setSelectedScopes] = useState(visibleScopes)

  useEffect(() => {
    const allBetScopes = availableScopes.filter(scope => belongsToBet(visibleBet, scope))
    setVisibleScopes(allBetScopes)
    setSelectedScopes(allBetScopes)
  }, [visibleBet])
  
  useEffect(() => {
    setVisibleBet(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
  }, [visibleCycle])

  useEffect(() => {
    if (!params || !params.id) {
      router.replace(`/cycles/${visibleCycle.id}`)
    }
  }, [])

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

  function shouldShowPitches() {
    if (!availableBets.length) return true
    if (availablePitches.length) return true
    return false
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

          <div className={`mt-16 ${!shouldShowPitches() && 'grid grid-cols-1 gap-6 lg:grid-cols-4'}`}>
            { !shouldShowPitches() && (
              <div>
                <CycleSidebar
                  availableBets={availableBets}
                  visibleBet={visibleBet}
                  onBetChange={onBetChange}
                  visibleScopes={visibleScopes}
                  selectedScopes={selectedScopes}
                  onScopeChange={onScopeChange}
                />
              </div>
            ) }
            <div className="lg:col-span-3">
              <Cycle
                visibleCycle={visibleCycle}
                inCycle={inCycle}
                previousCycle={previousCycle}
                nextCycle={nextCycle}
                pitches={availablePitches}
                selectedScopes={selectedScopes}
                shouldShowPitches={shouldShowPitches()}
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
    for (const c of data.cycles) {
      const startDate = new Date(c.startDate)
      const endDate = new Date(c.endDate)
      const now = new Date()
      cycle = c
      if (startDate <= now && endDate >= now) {
        inCycle = true
        break
      } else if (startDate > now) {
        inCycle = false
        break
      }
    }
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

function belongsToCycle(cycle, bet) {
  if (!cycle || !bet) return false
  return bet.cycle === cycle.id
}
