import React from 'react'
import { ReactNode } from 'react'
import { Button } from './ui/button'
import TextToggleButton from './text-toggle-button'
interface SectionProps {
  children: ReactNode,
  title: string
}

export const Section = ({children, title}: SectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between py-03">
        <h2 className="text-2xl font-bold">{title}</h2>
        <TextToggleButton />
      </div>
      {children}
    </section>
    
  )
}
