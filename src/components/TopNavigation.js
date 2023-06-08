import { getServerSession } from 'next-auth'
import { Logo } from './Logo'
import UserMenu from './UserMenu'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function TopNavigation() {
  const session = await getServerSession(authOptions)
  return (
    <div className="flex justify-between items-center py-2 border-b border-b-gray-200">
      <Logo size='s' gradient={false} />
      <div>
        <UserMenu user={session?.user} />
      </div>
    </div>
  )
}