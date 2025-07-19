import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

import { Order } from '../../data/types';

import axios from 'axios';
import { order } from '../../simulateData/data';

function Confirm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const[orderId, setOrderId] = useState<number | null>(0)
    const sentToServer =useRef(false);

    const [orderData, setOrderData] = useState<Order>(() => {
        const saved = localStorage.getItem('order');
        return saved
          ? JSON.parse(saved) as Order
          : {
                customer: { customer_name: '', customer_phone: '', customer_email: null },
                address: {
                city: '', cityId: '', district: '', districtId: '',
                ward: '', wardId: '', street: ''
                },
                payment_type: 'cash on delivery',
                subtotal: 0,
                delivery_fee: -1,
                note: null,
                order_id: -1,
                status: 'unknown',
                cart: null,
                weight: 0,
                arrival_date: null
            };
      });

    const cleanCache = () => {
        localStorage.removeItem("order")
    }

    useEffect(() => {
        setOrderId(orderData.order_id ?? null);
        cleanCache();
    }, []);

    return (
        <div>
            <NavBar />
            <div className='min-h-screen flex flex-col items-center justify-center py-20'>
                <div className='flex flex-col justify-center text-center lg:space-y-2.5'>
                    <div className='title text-deep_blue'>{t('your order has been placed!')}</div>
                    {orderData.order_id !== -1 ? (
                        <div>
                            <div className='h1'>{t('your order id is')}: <span className='h1 text-deep_blue'>{(orderId ?? "null")}</span></div>
                            <div className='h2_b'>{t('please save the order id to track your order')}</div>
                        </div>
                    ):(
                        <div className='h1'>{t('please check your email for order id')}</div>
                        )}
                </div>
                <Link to='/'><button className='primary-button h1 min-w-[200px] mt-10'>{t('return')}</button></Link>
            </div>
            <Footer />
        </div>
    );
}

export default Confirm;
