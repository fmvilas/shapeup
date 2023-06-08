import CyclePage from '@/components/CyclePage'
import { prepareData } from './cycles/[cycle]/page'
import { ProjectDetailsProvider } from '@/contexts/ProjectDetails'

export default async function ProjectPage({ params }) {
  const {
    project,
    visibleCycle,
    previousCycle,
    nextCycle,
    inCycle,
    availablePitches = [],
    availableBets = [],
    availableScopes = []
  }  = await prepareData(params)

  return (
    <ProjectDetailsProvider value={project}>
      <CyclePage
        visibleCycle={visibleCycle}
        previousCycle={previousCycle}
        nextCycle={nextCycle}
        inCycle={inCycle}
        availablePitches={availablePitches}
        availableBets={availableBets}
        availableScopes={availableScopes}
      />
    </ProjectDetailsProvider>
  )
}
