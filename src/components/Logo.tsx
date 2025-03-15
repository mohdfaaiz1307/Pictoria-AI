import React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const Logo = () => {
  return (
    <Link href="/" className='flex items-center gap-2'>
      <Sparkles className='size-8' strokeWidth={1.5}/>
      <span className='text-lg font-semibold'>Pictoria AI</span>
    </Link>
  )
}
