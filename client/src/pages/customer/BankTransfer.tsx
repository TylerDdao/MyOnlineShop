import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import PriceTag from '../../components/PriceTag';

import { BsArrowLeft, BsCopy, BsCheck } from "react-icons/bs";
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Order } from '../../data/types';
function BankTransfer() {
    const {t} = useTranslation();
   const navigate = useNavigate();
    // const [orderId] = useState(() => Math.floor(10000 + Math.random() * 90000));
    const orderId = localStorage.getItem('orderId');
    const total = parseFloat(localStorage.getItem('total') || '0');

    const [copiedField, setCopiedField] = useState('');
    const handleCopy = async (field, text) => {
        try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(''), 2000); // Reset after 2 sec
        } catch (err) {
        alert('Failed to copy');
        }
    };

    const [orderData, setOrderData] = useState<Order>(() => {
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
                    id: -1,
                    status: 'unknown',
                    cart: null,
                    total_weight: 0,
                    arrival_date: null
                };
        });

    const bank = import.meta.env.VITE_BANK;
    const accountNumber = import.meta.env.VITE_ACCOUNT_NUMBER;
    const accountName = import.meta.env.VITE_ACCOUNT_NAME;
    const qrUrl = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bank}&amount=${orderData.subtotal + (orderData.deliveryFee??0)}&des=${orderData.id}&template=compact`

    useEffect(()=>{
        if(orderData.id === -1){
          navigate("/")
        }
    }, [])

    return (
        <div>
        <NavBar />
        <div className='min-h-screen lg:flex lg:items-center lg:justify-center py-20 px-2.5'>
            <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px] space-y-5'>
                <div className='flex flex-col justify-center items-center text-center space-y-10 mb-10'>
                    <div className='lg:max-w-[600px] flex flex-col justify-center items-center text-center space-y-10'>
                        <div className='title'>{t('bank transfer')}</div>
                        <div className='w-full h-[1px] bg-black'></div>
                        <div className='p'>{t('please note that your order will be')} <span className='text-deep_blue h3'>{t('on hold for 24h maximum')}</span>{t(', once we received your payment, your order will be prepared and we will let you know the estimated arrival date')}</div>
                        <div className='w-full h-[1px] bg-black'></div>
                    </div>
                </div>
                <div className='lg:flex lg:items-start lg:text-left lg:space-x-10 space-y-5'>
                    <div className='lg:min-w-[400px] lg:max-w-[600px]'>
                        <form className='flex flex-col space-y-5'>
                            <div className='h1'>{t('your contact information')}</div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your name')}</div>
                                <div className='p'>{orderData.customer.name}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your phone number')}</div>
                                <div className='p'>{orderData.customer.phone}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('your email')}</div>
                                {orderData.customer.email ? (
                                    <div className='p'>{orderData.customer.email}</div>
                                ):(
                                    <div className='p text-gray'>{orderData.customer.email}</div>
                                )}
                            </div>

                            <div className='h1'>{t('your delivery address')}</div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('city')}</div>
                                <div className='p'>{orderData.address.city}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('district')}</div>
                                <div className='p'>{orderData.address.district}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('ward')}</div>
                                <div className='p'>{orderData.address.ward}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('street number')}</div>
                                <div className='p'>{orderData.address.street}</div>
                            </div>
                            <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                                <div className='h3'>{t('note')}</div>
                                {orderData.note ? (
                                    <div className='p'>{orderData.note}</div>
                                ) : (
                                    <div className='p text-gray'>{t('no note')}</div>
                                )}
                            </div>
                        </form>

                    </div>

                    <div className='lg:min-w-[400px] lg:flex lg:flex-col lg:space-y-5'>
                        <div className='title'>{t('please scan to pay')}</div>
                        <img src={qrUrl} alt='QR Code' className='w-auto lg:h-[360px]'/>
                        <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                            <div className='flex lg:space-x-2.5 items-center'>
                            <div className='p'>{t('amount')}: <PriceTag className='h3 text-deep_blue' value={orderData.subtotal + (orderData.deliveryFee ?? 0)}/></div>
                                <button onClick={()=>handleCopy('amount',total.toString())}>
                                    {copiedField === 'amount' ? (
                                    <BsCheck className="text-green-500 text-xl" />
                                    ) : (
                                    <BsCopy className="text-xl hover:text-blue-500" />
                                    )}
                                </button>
                            </div>
                            <div className='lg:flex lg:flex-col lg:spcae-y-2.5'>
                                <div className='flex lg:space-x-2.5 items-center'>
                                    <div className='p'>{t('description')}: <span className='h3 text-deep_blue'>{orderData.id}</span></div>
                                    <button onClick={()=>handleCopy('description',orderData.id)}>
                                        {copiedField === 'description' ? (
                                        <BsCheck className="text-green-500 text-xl" />
                                        ) : (
                                        <BsCopy className="text-xl hover:text-blue-500" />
                                        )}
                                    </button>
                                </div>
                                <div className='p text-tomato_red'>{t('please transfer with exactly the same description displayed')}</div>
                            </div>
                            <div className='flex lg:space-x-2.5 items-center'>
                                <div className='p'>{t('recipient')}: <span className='h3 text-deep_blue'>{accountName}</span></div>
                                <button onClick={()=>handleCopy('accountName',accountName)}>
                                    {copiedField === 'accountName' ? (
                                    <BsCheck className="text-green-500 text-xl" />
                                    ) : (
                                    <BsCopy className="text-xl hover:text-blue-500" />
                                    )}
                                </button>
                            </div>
                            <div className='flex lg:space-x-2.5 items-center'>
                                <div className='p'>{t('account number')}: <span className='h3 text-deep_blue'>{accountNumber}</span></div>
                                <button onClick={()=>handleCopy('accountNumber',accountNumber)}>
                                    {copiedField === 'accountNumber' ? (
                                    <BsCheck className="text-green-500 text-xl" />
                                    ) : (
                                    <BsCopy className="text-xl hover:text-blue-500" />
                                    )}
                                </button>
                            </div>
                            <div className='p'>{t('bank')}: <span className='h3 text-deep_blue'>{bank}</span></div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <Link to='/payment'><button className='secondary-button h1 min-w-[200px] flex items-center justify-center lg:space-x-2.5'><BsArrowLeft className='h-[25px] w-[25px] inline-block'/> <span>{t('payment')}</span></button></Link>
                    <Link to='/confirm'><button className='primary-button h1 min-w-[200px]'>{t('done')}</button></Link>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default BankTransfer
