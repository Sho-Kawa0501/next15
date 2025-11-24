"use client"

import React, { useState } from 'react'
import CategorySidebar from './category-sidebar'
import { CategoryMenu } from '@/types'
import { Section } from './section'
import CarouselContainer from './carousel-container'
import MenuCard from './menu-card'
import FlatMenuCard from './flat-menu-card'
import { InView } from "react-intersection-observer"
import MenuModal from './menu-modal'
import { useModal } from '@/app/context/modalContext'
import { useCartVisibility } from '@/app/context/cartContext'
import { useCart } from '@/hooks/cart/useCart'

interface MenuContentProps {
  categoryMenus: CategoryMenu[]
  restaurantId: string
}

const MenuContent = ({categoryMenus, restaurantId}: MenuContentProps) => {
  // メニューモーダル開閉状態管理
  const { isOpen, setIsOpen, openModal, closeModal, selectedItem } = useModal()
  // カートモーダル開閉状態管理
  const { openCart } = useCartVisibility()
  // 選択中レストランのカート情報取得
  const { targetCart, mutateCart } = useCart(restaurantId, false)
  // メニューカテゴリー
  const [ activeCategoryId, setActiveCategoryId ] = useState(categoryMenus[0].id)
  // カテゴリー名押下時
  const handleSelectCategory = (categoryId: string) => {
    const element = document.getElementById(`${categoryId}-menu`)
    if(element) {
      element.scrollIntoView({ behavior: "smooth"})
    }
  }

  return (
    <div className='flex'>
      <CategorySidebar 
        categoryMenus={categoryMenus}
        onSelectCategory={handleSelectCategory}
        activeCategoryId={activeCategoryId}
        />
      <div className='w-3/4'>
        {categoryMenus.map((category) => (
          <InView 
            key={category.id}
            id={`${category.id}-menu`}
            className="scroll-mt-16"
            as="div"
            threshold={0.7}
            onChange={(inView, entry) =>
              inView && setActiveCategoryId(category.id)
            }
          >
            <Section title={category.categoryName}>
              {category.id === "featured" ? (
                <CarouselContainer slideToShow={4}>
                  {category.items.map((menu) => (
                    <MenuCard 
                      menu={menu}
                      onClick={openModal} />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard 
                      key={menu.id}
                      menu={menu}
                      onClick={openModal} />
                  ))}
                </div>
              )}
            </Section>
          </InView>
        ))}
      </div>
      <MenuModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
        restaurantId={restaurantId}
        openCart={openCart}
        targetCart={targetCart}
        mutateCart={mutateCart}
        />
    </div>
  )
}

export default MenuContent