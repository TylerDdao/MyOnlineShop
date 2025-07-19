import { useState,useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import ProductCartList from '../../components/ProductCartList'
import PriceTag from '../../components/PriceTag';

import {CartItem, Order} from '../../data/types'

// import { order } from '../../simulateData/data';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

// import { order } from '../../simulateData/data';

function OrderDetail() {
    const {t, i18n} = useTranslation();

    const [orderData, setOrderData] =useState<Order>()
    const [formatted, setFormatted] = useState<string>('N/A');
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchOrder = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/search-order`, {
            params: {
              order_id: orderId,
            },
          });
          if(response.status=200){
            setOrderData(response.data.order);
          }
        } catch (error) {
          console.error('Error fetching order:', error);

          // Check if the server responded with 404 or other error
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
              navigate(`/error?code=404&message=Order not found`);
            } else {
              navigate(`/error?code=${status || 500}&message=Something went wrong`);
            }
          } else {
            navigate(`/error?code=500&message=Unexpected error`);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder(); // ✅ You must call the async function
    }, [orderId]); // include orderId if it's dynamic
    
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
      {isLoading &&(
            <div id='fetching' className='fixed w-full h-full bg-gray flex flex-col items-center justify-center'>
            <ClipLoader
                color="#496287"    // color of the spinner
                loading={true}     // boolean, when true it spins
                size={50}          // size in px
            />
            <div className='h2'>{t('loading')}</div>
            </div>
        )}
      <div className='min-h-screen lg:flex lg:items-center lg:justify-center py-20 px-2.5'>
        <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px] lg:space-y-5'>
          <div className='flex flex-col justify-center text-center space-y-10 mb-10'>
            <div className='title'>{t('my order')}</div>
            <div className='w-full h-[1px] bg-black'></div>
          </div>
            <div className='lg:flex lg:items-start lg:text-left lg:space-x-10'>
              <div className='lg:min-w-[400px]'>
                <div className='lg:flex lg:flex-col space-y-5'>
                <div className='h1'>{t('your order information')}</div>
                    <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                        <div className='h3'>{t('order id')}</div>
                        <div className='p'>{orderData?.order_id}</div>
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
                            {orderData?.delivery_fee !== undefined && orderData.delivery_fee !== null ? (
                                orderData?.delivery_fee === 0 ? (
                                    <div>
                                        <div className='h2 text-success_green'>{t('free')}</div>
                                    </div>
                                ) : (
                                    <div>
                                        <PriceTag className='h2' value={orderData?.delivery_fee}/>
                                    </div>
                                )
                            ) : (
                                <div>{t('loading')}</div>
                            )}
                        </div>
                        <div className='border-[1px] border'></div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='h2'>{t('total')}</div>
                            <PriceTag value={(orderData?.delivery_fee ?? 0) + (orderData?.subtotal ?? 0)} className='h2 text-deep_blue'/>
                        </div>

                        <div className='lg:flex lg:justify-between'>
                            <div className='h3'>{t('payment method')}:</div>
                            <div className='p'>{t(orderData?.payment_type ?? "unknown")}</div>
                        </div>
                    </div>

                  <div className='h1'>{t('your contact information')}</div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your name')}</div>
                    <div className='p'>{orderData?.customer.customer_name}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your phone number')}</div>
                    <div className='p'>{orderData?.customer.customer_phone}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your email')}</div>
                    <div className='p'>{orderData?.customer.customer_email}</div>
                  </div>

                  <div>
                    <div className='h1'>{t('your delivery address')}</div>
                    <div className='p text-tomato_red'>{t('note: this is the address before merging')}</div>
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('city')}</div>
                    <div className='p'>{orderData?.address.city}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('district')}</div>
                    <div className='p'>{orderData?.address.district}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('ward')}</div>
                    <div className='p'>{orderData?.address.ward}</div>
                  </div>

                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('street number')}</div>
                    <div className='p'>{orderData?.address.street}</div>
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
