'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import styles from './Header.module.css'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <>
      <header>
        <div className={styles.status}>
          {!session && (
            <>
              <p>
                You are not <strong>signed in</strong>
              </p>
              <button className={styles.button__sign} onClick={() => signIn()}>
                Sign in
              </button>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className='avatar'
                />
              )}

              <div>
                <p>{session.user?.name}</p>
                <p>{session.user?.email}</p>
              </div>

              <p>
                You are <strong>signed</strong>
              </p>
              <button className={styles.button__sign} onClick={() => signOut()}>
                Sign out
              </button>
            </>
          )}
        </div>
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li>
              <Link href={'/'}>Home</Link>
            </li>
            <li>
              <Link href={'/public'}>Public</Link>
            </li>
            <li>
              <Link href={'/private'}>Private</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
