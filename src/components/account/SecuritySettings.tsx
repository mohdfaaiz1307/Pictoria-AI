/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import React, { useId } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { resetPassword } from '@/app/actions/auth-actions'

interface SecuritySettingsProps {
    user: User
}

const SecuritySettings = ({user}: SecuritySettingsProps) => {

    const toastId = useId()
    
          async function handleChangePassword() {
            toast.loading('sending password reset email...', {id: toastId})
            try{
                const {success, error} = await resetPassword({email: user.email || ""});
                if(!success){
                    toast.error(error, {id: toastId})
                }else{
                    toast.success("Password reset email sent! Please check your email for instructions.", {id: toastId})
                }
            }catch(error: any){
                toast.error(error?.message || "There is an error sending the password reset email!", {id: toastId})
            }
    
          }

  return (
    <Card>
        <CardHeader>
            <CardTitle>
                Security
            </CardTitle>

        </CardHeader>
        <CardContent>
            <div className='space-y-2'>
                <h3 className='font-medium'>Password</h3>
                <p className='text-sm text-muted-foreground'>Change your password to keep your account secure</p>
                <Button variant={"outline"} onClick={handleChangePassword}>Change Password</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default SecuritySettings