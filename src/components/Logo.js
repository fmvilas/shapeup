import Link from "next/link"

export function Logo({ size = 'l', gradient = true }) {
  let sizeClassNames
  switch (size) {
    case 's':
      sizeClassNames = 'text-xl leading-10 sm:text-2xl sm:leading-none sm:tracking-tight lg:text-xl'
      break;
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
      <div className={`font-extrabold text-gray-700 ${sizeClassNames}`}>
      🏋️‍♀️ <span className={gradient ? 'shapeup-animated-gradient' : ''}>Shape It!</span>
      </div>
    </Link>
  )
}
