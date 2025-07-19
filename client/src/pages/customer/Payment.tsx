import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import PriceTag from '../../components/PriceTag';
import { Address, Order, Customer, CartItem, ShipmentFeeResponse} from '../../data/types';

import { BsArrowLeft, BsBank, BsCash  } from "react-icons/bs";

// import { fetchShipmentFee } from '../../api/shipment';
import { order } from '../../simulateData/data';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

// import { order, customer } from '../../simulateData/data';

function Payment() {
    const sentToServer = useRef(false)
    const navigate= useNavigate()
    const [paymentMethod, setPaymentMethod] = useState('cash on delivery');
    const [nextStepUrl, setNextStepUrl] = useState('/confirm');
    const [nextStep, setNextStep] = useState('confirm');
    const paymentOptions = [
        { value: 'cash on delivery', icon: <BsCash /> },
        { value: 'bank transfer', icon: <BsBank /> },
    ];
    const [cart, setCart] = useState<CartItem[]>([])
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const method = event.target.value;
        setPaymentMethod(method);
        setNextStepUrl(method === 'bank transfer' ? '/bank-transfer' : '/confirm');
        setNextStep(method === 'bank transfer' ? 'bank transfer' : 'confirm');
        setOrderData(prev => ({ ...prev, payment_type: method as 'cash on delivery' | 'bank transfer' }));
    }
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
    const finalizeOrder = async () => {
        let isValid = false;
        let orderId;

        while (!isValid) {
            orderId = Math.floor(10000 + Math.random() * 90000);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/verify-orderid`, {
                params: { id: orderId }
            });
            if (response.data?.isValid === true) {
                isValid = true;
            }
        }

        const status: Order["status"] = orderData.payment_type == 'bank transfer'
            ? "on hold"
            : orderData.payment_type == 'cash on delivery'
                ? "on prepared"
                : "unknown";

        const newOrderData = {
            ...orderData,
            order_id: orderId,
            status
        };

        // update state for UI
        setOrderData(newOrderData);

        // send order with correct id
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/place-order`, newOrderData);
            console.log('Order submitted successfully:', response.data);
            sentToServer.current = true;
            return response.data;
        } catch (error) {
            console.error('Failed to submit order:', error);
            throw error;
        }
    };

    const handleConfirm = async () => {
        try {
            setIsLoading(true)

            if (!sentToServer.current) {
                await finalizeOrder();
            }

            setIsLoading(false)
            navigate(`${nextStepUrl}`)
        } catch (error) {
            console.error("Error while verifying order ID:", error);
            alert("Failed to place order. Please try again.");
            navigate('/')
        }
    };

    useEffect(() => {
    localStorage.setItem('order', JSON.stringify(orderData));
    }, [orderData]);

    useEffect(() => {
        setNextStepUrl(orderData.payment_type === 'bank transfer' ? '/bank-transfer' : '/confirm');
        setNextStep(orderData.payment_type === 'bank transfer' ? 'bank transfer' : 'confirm');
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
            setCart(JSON.parse(savedCart))
            } catch (error) {
            console.error("Failed to parse cart:", error)
            }
        }
    }, [])
    return (
        <div>
        <NavBar />
        {isLoading &&(
        <div id='fetching' className='fixed w-full h-full bg-gray flex flex-col items-center justify-center opacity-50'>
          <ClipLoader
            color="#496287"    // color of the spinner
            loading={true}     // boolean, when true it spins
            size={50}          // size in px
          />
          <div className='h2'>{t('loading')}</div>
        </div>)}
        <div className='min-h-screen lg:flex lg:items-center lg:justify-center py-20 px-2.5'>
            <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px] lg:space-y-5'>
                <div className='flex flex-col justify-center text-center space-y-10 mb-10'>
                    <div className='title'>{t('payment')}</div>
                    <div className='w-full h-[1px] bg-black'></div>
                </div>
                <div className='lg:flex lg:items-start lg:text-left lg:space-x-10 space-y-2.5'>
                    <div className='lg:min-w-[400px]'>
                        <form className='flex flex-col space-y-5'>
                            <div className='h1'>{t('your contact information')}</div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your name')}</div>
                                <input id='name' type='text' className='w-full' value={orderData.customer.customer_name} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your phone number')}</div>
                                <input id='phone' type='tel' className='w-full' value={orderData.customer.customer_phone} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your email')}</div>
                                {orderData.customer.customer_email ? (
                                    <input id='email' type='email' className='w-full' value={orderData.customer.customer_email} disabled/>
                                ) : (
                                    <input id='email' type='email' className='w-full text-gray' value={t('no email')} disabled/>
                                )}
                            </div>

                            <div className='h1'>{t('your delivery address')}</div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('city')}</div>
                                <input id='city' type='text' className='w-full' value={orderData.address.city} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('district')}</div>
                                <input id='district' type='text' className='w-full' value={orderData.address.district} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('ward')}</div>
                                <input id='ward' type='text' className='w-full' value={orderData.address.ward} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('street number')}</div>
                                <input id='street-number' type='text' className='w-full' value={orderData.address.street} disabled/>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('note')}</div>
                                {orderData.note ? (
                                    <textarea id='note' className='w-full' value={orderData.note} disabled/>
                                ) : (
                                    <textarea id='note' className='w-full text-gray' value={t('no note')} disabled/>
                                )}
                            </div>
                        </form>

                    </div>

                    <div className='lg:min-w-[400px] flex flex-col space-y-2.5'>
                        <div className='h1'>{t('your bill')}</div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='lg:text-[18.72px]'>{t('subtotal')}</div>
                            <PriceTag value={orderData.subtotal} className='h2'/>
                        </div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='lg:text-[18.72px]'>{t('delivery fee')}</div>
                            {orderData.delivery_fee !== undefined && orderData.delivery_fee !== null ? (
                                orderData.delivery_fee === 0 ? (
                                    <div className='h2 text-success_green'>{t('free')}</div>
                                ) : (
                                    <PriceTag className='h2' value={orderData.delivery_fee}/>
                                )
                            ) : (
                                <div>{t('loading')}</div>
                            )}
                        </div>
                        <div className='border-[1px] border'></div>
                        <div className='lg:flex lg:justify-between'>
                            <div className='h1'>{t('total')}</div>
                            <PriceTag value={(orderData.delivery_fee ?? 0) + orderData.subtotal} className='h1'/>
                        </div>

                        <div className='flex flex-col'>
                            <div className='h1 mb-2.5'>{t('payment method')}</div>
                            <div className='flex flex-col space-y-2.5'>
                                {paymentOptions.map((option, index) => (
                                <label key={index} className='h2_b flex items-center space-x-2.5 cursor-pointer'>
                                <input value={option.value} type='radio' name='payment-method' key={index} className='h1' checked={orderData.payment_type === option.value} onChange={handlePaymentMethodChange}/>
                                <span className=''>{t(option.value)} {option.icon}</span>
                                </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between items-center mt-10'>
                    <Link to='/check-out'><button className='secondary-button h1 min-w-[200px] flex items-center justify-center space-x-2.5'><BsArrowLeft className='h-[25px] w-[25px] inline-block'/> <span>{t('check out')}</span></button></Link>
                    <button className='primary-button h1 min-w-[200px]' onClick={handleConfirm}>{t(nextStep)}</button>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default Payment
