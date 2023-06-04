import Link from "next/link"

export function Logo({ size = 'l' }) {
  let sizeClassNames
  switch (size) {
    case 'm':
      sizeClassNames = 'text-xl leading-10 sm:text-2xl sm:leading-none sm:tracking-tight lg:text-3xl'
      break;
    case 'l':
    default:
      sizeClassNames = 'text-4xl leading-10 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl'
      break;
  }
  return (
    <Link href="/">
      <div className={`font-extrabold text-gray-900 ${sizeClassNames}`}>
        <span className="shapeup-animated-gradient">Shape Up</span> 🏋️‍♀️
      </div>
    </Link>
  )
}
