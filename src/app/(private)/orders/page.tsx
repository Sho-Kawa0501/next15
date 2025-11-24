import OrderCard from '@/components/order-card'
import { fetchOrders } from '@/lib/orders/api'
import React from 'react'

const OrderPage = async () => {
  const orders = await fetchOrders()
  if (orders.length === 0) {
    return <div>過去の注文がありません。</div>;
  }
  return (
    <div className='space-y-6'>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export default OrderPage