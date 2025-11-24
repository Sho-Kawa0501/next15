import DeliveryAnimation from '@/components/delivery-animation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const CheckoutCompletePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="font-bold text-3xl">ご注文の品を準備しています…</h1>
      <DeliveryAnimation />
      <Button size={"lg"} asChild>
        <Link href={"/orders"}>注文履歴へ</Link>
      </Button>
    </div>
  )
}

export default CheckoutCompletePage