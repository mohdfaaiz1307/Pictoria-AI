import AccountForm from '@/components/account/AccountForm'
import SecuritySettings from '@/components/account/SecuritySettings'
import { getUser } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AccountSettings = async () => {
  const supabase = await createClient()
  const user = await getUser(supabase);

  if(!user){
    return redirect("/login")
  }

  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Account Settings</h1>
        <p className='text-muted-foreground '>Manage your account settings and preferences</p>
      </div>

      <div className='grid gap-8 '>
        <AccountForm user={user}/>
        <SecuritySettings user={user}/>
      </div>
    </section>
  )
}

export default AccountSettings