import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import ProductCartList from '../../components/ProductCartList'
import PriceTag from '../../components/PriceTag'

import { CartItem , Order} from '../../data/types'

function MyCart() {
const { t } = useTranslation()
const navigate = useNavigate()
const location = useLocation()

// Load cart from localStorage once
const [cart, setCart] = useState<CartItem[]>([])
const [order, setOrder] = useState<Order>(() => {
  const saved = localStorage.getItem('order');
  return saved
    ? JSON.parse(saved) as Order
    : {
        customer: { name: '', phone: '', email: null },
        address: {
        city: '', cityId: '', district: '', districtId: '',
        ward: '', wardId: '', street: ''
        },
        payment: 'cash on delivery',
        subtotal: 0,
        deliveryFee: -1,
        note: null,
        id: 0,
        status: 'unknown',
        cart: null,
        total_weight: 0,
        arrival_date: null
      };
  });

useEffect(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      setCart(JSON.parse(savedCart));
    } catch (error) {
      console.error("Failed to parse cart:", error)
    }
  }
  localStorage.removeItem("order")
}, []);

useEffect(() => {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total_weight = cart.reduce((total_weight, item) => total_weight + item.weight, 0);
  const updatedOrder = { ...order, subtotal, cart, total_weight};
  setOrder(updatedOrder);
  // alert(order?.total_weight)
  localStorage.setItem('order', JSON.stringify(updatedOrder));
}, [cart]);

const handleCheckout = () => {
navigate('/check-out')
}

return (
<div>
    <NavBar />
    <div className='min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center py-20 px-2.5'>
    <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px]'>
        <div className='flex flex-col justify-center text-center space-y-10 mb-10'>
            <div className='title'>{t('my cart')}</div>
            <div className='w-full h-[1px] bg-black'></div>
        </div>
        {cart.length > 0 ? (
        <div className='text-left'>
            <ProductCartList removeable={true} cartList={cart} 
                onRemove={(id, selectedAttributes) => {
                const newCart = cart.filter(item =>
                !(item.productId === id && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes))
                );
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
                }} 
                onClear={()=>{
                    setCart([]);
                    localStorage.setItem('cart', JSON.stringify([]));
                }}
            />
            <div className='flex flex-col w-full text-right justify-end my-5 space-y-5'>
            <div className='flex justify-end'>
                <div className='w-2/3 h-[1px] bg-black'></div>
            </div>
            <div className='flex flex-col lg:space-y-2.5'>
                <div className='h1'>
                {t('subtotal')}: <PriceTag value={order.subtotal} />
                </div>
            </div>
            </div>
            <div className='flex justify-between'>
            <button
                className='secondary-button h1 min-w-[200px]'
                onClick={() => navigate('/products')}
            >
                {t('continue shopping')}
            </button>
            <button
                className='primary-button h1 min-w-[200px]'
                onClick={handleCheckout}
            >
                {t('check out')}
            </button>
            </div>
        </div>
        ) : (
        <div className='flex flex-col justify-center items-center space-y-2.5'>
          <div className='h1'>{t('your cart is empty')}</div>
          <button
                className='secondary-button h1 min-w-[200px]'
                onClick={() => navigate('/products')}
            >
                {t('continue shopping')}
            </button>
        </div>
        )}
    </div>
    </div>
    <Footer />
</div>
)
}

export default MyCart
