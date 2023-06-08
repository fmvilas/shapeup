import Link from 'next/link'
import { useProjectDetails } from '@/contexts/ProjectDetails'

export default function Header() {
  const { title, number, org, ownerType } = useProjectDetails()

  return (
    <div className="lg:flex lg:justify-between">
      <div className="max-w-xl">
        <Link href={`/projects/${ownerType}/${org}/${number}`}>
          <h2 className="text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl">
            <span className="shapeup-animated-gradient">{title}</span>
          </h2>
        </Link>
        <p className="mt-5 text-xl leading-7 text-gray-500 prose prose-pink">
          Visualize the progress of your work.
        </p>
      </div>
    </div>
  )
}