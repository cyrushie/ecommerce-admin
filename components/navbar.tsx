import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { MainNav } from '@/components/main-nav'
import StoreSwitcher from './store-switcher'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const Navbar = async () => {
    const { userId } = auth()

    if (!userId) {
        return redirect('/sign-in')
    }

    const stores = await db.store.findMany({
        where: {
            userId
        }
    })

    return (
        <div className='border-b'>
            <div className='flex px-4 items-center h-16'>
                <StoreSwitcher items={stores} />
                <MainNav className='mx-6' />
                <div className="ml-auto flex items-center justify-center p-4">
                    <UserButton afterSignOutUrl='/' />
                </div>
            </div>
        </div>
    )
}

export default Navbar