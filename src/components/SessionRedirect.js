'use client';

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function SessionRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log(status)
    if (status === 'unauthenticated') {
      router.replace('/')
    }
  }, [status])

  return (
    <></>
  )
}