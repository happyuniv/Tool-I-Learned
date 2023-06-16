'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <div>
        <h1>Private Page</h1>
        {!session && (
          <>
            <p>
              This is private page.
              <br />
              You should&nbsp;
              <Link href={'/api/auth/signin'}>Sign in</Link>
              &nbsp;to view private information!
            </p>
          </>
        )}
        {session?.user && (
          <>
            {session.user?.image && (
              <span
                style={{ backgroundImage: `url('${session.user.image}')` }}
                className='avatar'
              />
            )}

            <div>
              <p>name: {session.user?.name}</p>
              <p>email: {session.user?.email}</p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
