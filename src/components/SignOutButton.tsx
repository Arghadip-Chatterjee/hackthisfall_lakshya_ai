'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <button className='mt-4 border rounded text-center text-white p-4' onClick={() => signOut({ redirectUrl: '/sign-in' })}>Sign out</button>
  )
}