"use client"
import React from 'react'
import { useState } from 'react'
import { ReactNode } from 'react'
import { Button } from './ui/button'
import TextToggleButton from './text-toggle-button'
interface SectionProps {
  children: ReactNode,
  title: string,
  expandedContent?: ReactNode
}

export const Section = ({children, title, expandedContent}: SectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
    const handleChange  = () => {
      setIsExpanded((prev) => !prev)
    }
  return (
    <section>
      <div className="flex items-center justify-between py-03">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={handleChange}>{isExpanded ? "表示を戻す": "全て表示"}</Button>
      </div>
      {isExpanded ? expandedContent : children}
    </section>
    
  )
}
