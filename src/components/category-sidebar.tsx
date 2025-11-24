"use client"

import { cn } from '@/lib/utils'
import { CategoryMenu } from '@/types'
import React, { useState } from 'react'

interface CategorySidebarProps {
  categoryMenus: CategoryMenu[]
  onSelectCategory: (categoryId: string) => void
  activeCategoryId: string
}
const CategorySidebar = ({
  categoryMenus,
  onSelectCategory,
  activeCategoryId
}: CategorySidebarProps) => {
  

  return (
    <aside className="w-1/4 sticky top-16 h-[calc(100vh-64px)]">CategorySidebar
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul>
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button 
                onClick={() => onSelectCategory(category.id)}
                type="button"
                className={cn(
                  "w-full p-4 text-left border-l-4 transition-colors",
                  activeCategoryId === category.id
                    ? "bg-input font-medium border-primary"
                    : "border-transparent hover:bg-muted"
                )}
                >
                {category.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default CategorySidebar