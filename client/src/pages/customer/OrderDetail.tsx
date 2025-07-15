import { useState,useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import ProductCartList from '../../components/ProductCartList'
import PriceTag from '../../components/PriceTag';

import {CartItem, Order} from '../../data/types'

import { order } from '../../simulateData/data';

// import { order } from '../../simulateData/data';

function OrderDetail() {
    const {t, i18n} = useTranslation();

    const [orderData, setOrderData] =useState<Order>()
    const [formatted, setFormatted] = useState<string>('N/A');

    useEffect(() => {
        setOrderData(order);
    }, [])
    
    useEffect(() => {
        const date = orderData?.arrival_date ? new Date(orderData.arrival_date) : null;
        if (date) {
            if (i18n.language === 'vi') {
                setFormatted(date.toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }));
            } else if (i18n.language === 'en') {
                setFormatted(date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }));
            } else {
                setFormatted('N/A');
            }
        } else {
            setFormatted('N/A');
        }
    }, [orderData?.arrival_date, i18n.language]);

    return (
        <div>
      <NavBar />
      <div className='min-h-screen lg:flex lg:items-center lg:justify-center py-20 px-2.5'>
        <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px] lg:space-y-5'>
          <div className='flex flex-col justify-center text-center space-y-10 mb-10'>
            <div className='title'>{t('check out')}</div>
            <div className='w-full h-[1px] bg-black'></div>
          </div>
            <div className='lg:flex lg:items-start lg:text-left lg:space-x-10'>
              <div className='lg:min-w-[400px]'>
                <div className='lg:flex lg:flex-col space-y-5'>
                <div className='h1'>{t('your order information')}</div>
                    <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                        <div className='h3'>{t('order id')}</div>
                        <div className='p'>{orderData?.id}</div>
                    </div>
                    <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                        <div className='h3'>{t('order status')}</div>
                        <div className='p'>{orderData?.status}</div>
                    </div>
                    <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                        <div className='h3'>{t('estimated arrival date')}</div>
                        <div className='p'>{formatted}</div>
                </div>

                    <div className='lg:min-w-[400px] flex flex-col space-y-2.5'>
                        <div className='h1'>{t('your bill')}</div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='h2'>{t('subtotal')}</div>
                            <PriceTag value={orderData?.subtotal} className='h2'/>
                        </div>
                        <div className='lg:flex lg:justify-between'>
                            <div>
                                <div className='h2'>{t('delivery fee')}</div>
                                <div className='disclaimer text-success_green'>{t('delivered by GHTK')}</div>
                            </div>
                            {orderData?.deliveryFee !== undefined && orderData.deliveryFee !== null ? (
                                orderData?.deliveryFee === 0 ? (
                                    <div>
                                        <div className='h2 text-success_green'>{t('free')}</div>
                                    </div>
                                ) : (
                                    <div>
                                        <PriceTag className='h2' value={orderData?.deliveryFee}/>
                                    </div>
                                )
                            ) : (
                                <div>{t('loading')}</div>
                            )}
                        </div>
                        <div className='border-[1px] border'></div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='h2'>{t('total')}</div>
                            <PriceTag value={(orderData?.deliveryFee ?? 0) + (orderData?.subtotal ?? 0)} className='h2 text-deep_blue'/>
                        </div>

                        <div className='lg:flex lg:justify-between'>
                            <div className='h3'>{t('payment method')}:</div>
                            <div className='p'>{t(orderData?.payment ?? "unknown")}</div>
                        </div>
                    </div>

                  <div className='h1'>{t('your contact information')}</div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your name')}</div>
                    <div className='p'>{orderData?.customer.name}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your phone number')}</div>
                    <div className='p'>{orderData?.customer.phone}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your email')}</div>
                    <div className='p'>{orderData?.customer.email}</div>
                  </div>

                  <div>
                    <div className='h1'>{t('your delivery address')}</div>
                    <div className='p text-tomato_red'>{t('note: the address being used is the old address before merging')}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('city')}</div>
                    <div className='p'>{orderData?.customer.name}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('district')}</div>
                    <div className='p'>{orderData?.customer.name}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('ward')}</div>
                    <div className='p'>{orderData?.customer.name}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('street number')}</div>
                    <div className='p'>{orderData?.customer.name}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('note')}</div>
                    {orderData?.note ? (
                      <div className='p'>{orderData?.note}</div>):(
                        <div className='p text-gray'>{t('no note')}</div>
                      )}
                  </div>
                </div>
              </div>

              <div className='mt-10 lg:mt-0'>
                <div className='h1 text-left'>{t('my cart')}</div>
                <div className='flex flex-col space-y-5'>
                    {orderData?.cart ? (
                        <ProductCartList cartList={orderData?.cart} />
                    ):(
                        <div className='text-center p-5'>{t('your cart is empty')}</div>
                    )}
                </div>
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
    )
}

export default OrderDetail
