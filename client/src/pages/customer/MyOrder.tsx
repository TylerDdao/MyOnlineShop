import { useState } from 'react'
import { useTranslation } from 'react-i18next';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function MyOrder() {
    const [orderId, setOrderId] = useState<string|null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {t} = useTranslation();
    return (
        <div>
        <NavBar />
        <div className='min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center lg:py-20'>
            <div className='flex flex-col justify-center text-center lg:space-y-10'>
                <div className='title'>{t('search order')}</div>
                <div className='flex flex-col justify-end items-end lg:space-y-5'>
                    <input type='number' className='border border-black w-full' placeholder={t('enter your order id')} onChange={(e) => setOrderId(e.target.value)}/>
                    <Link to={`/my-order/${orderId}`}><button className='primary-button'>{t('find order')}</button></Link>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default MyOrder
