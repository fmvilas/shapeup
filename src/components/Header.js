import Link from 'next/link'
import config from '../../shapeup.config'

export default function Header() {
  return (
    <div className="lg:flex lg:justify-between">
      <div className="max-w-xl">
        <a href="https://www.asyncapi.com" target="_blank">
          <img src="/logo.svg" className="h-7 mb-4" />
        </a>
        <Link href="/">
          <h2 className="text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl">
            <span className="shapeup-animated-gradient">Shape Up</span> 🏋️‍♀️
          </h2>
        </Link>
        <p className="mt-5 text-xl leading-7 text-gray-500 prose prose-pink" dangerouslySetInnerHTML={{ __html: config.tagline }} />
      </div>
    </div>
  )
}