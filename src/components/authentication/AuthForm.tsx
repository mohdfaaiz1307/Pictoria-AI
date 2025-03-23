"use client"

import React, { useState } from 'react'
import LoginForm from './LoginForm';
import { Button } from '../ui/button';
import SignupForm from './SignupForm';
import Link from 'next/link';
import ResetPassword from './ResetPassword';

const AuthForm = ({state}: {state: string}) => {
    const [mode, setMode] = useState(state);
  return (
    <div className='space-y-6'>
        <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
            {
                mode === 'reset' ? "Reset Password" : mode === 'login' ? "Login" : "Sign Up"
            }
            </h1>
            <p className='text-sm text-muted-foreground'>
            {
                mode === 'reset' ? "Enter your email below to reset your password" : mode === 'login' ? "Enter your email below to login to your account" : "Enter your information below to create an account "
            }
            </p>
        </div>
        {
            mode === "login" && <>
            <LoginForm/>
            <div className='text-center flex justify-between '>
                <Button variant={"link"} className='p-0' onClick={()=> setMode("signup")}>
                    Need an account? Sign Up 
                </Button>
                <Button variant={"link"} className='p-0' onClick={()=> setMode("reset")}>
                    Forgot password?  
                </Button>
            </div>
            </>
        }
        {
            mode === "signup" &&
            <>
            <SignupForm/>
            <div className='text-center'>
                <Button variant={"link"} className='p-0' onClick={()=> setMode("login")}>
                    Already have an account? Login
                </Button>
            </div>
            <p className='px-8 text-center text-sm text-muted-foreground'>
                By clicking sign up, you agree to our <Link href="#" className="underline underline-offset-4 hover:text-primary"> Terms of Service</Link> and <Link href="#" className="underline underline-offset-4 hover:text-primary"> Privacy Policy.</Link> 
            </p>
            </>
        }
        {
            mode === "reset" && <> <ResetPassword/>
            <div className='text-center'>
                <Button variant={"link"} className='p-0' onClick={()=> setMode("login")}>
                    Back to login
                </Button>
            </div>
            </>
        }
    </div>
  )
}

export default AuthForm