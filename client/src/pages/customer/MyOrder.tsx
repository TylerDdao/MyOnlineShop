import { useState } from 'react'
import { useTranslation } from 'react-i18next';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

function MyOrder() {
    const {t} = useTranslation();
    const handleSearchOrder = () => {
        
    }
    return (
        <div>
        <NavBar />
        <div className='min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center lg:py-20'>
            <div className='flex flex-col justify-center text-center lg:space-y-10'>
                <div className='title'>{t('search order')}</div>
                <div className='flex flex-col justify-end items-end lg:space-y-5'>
                    <input type='text' className='border border-black w-full' placeholder={t('enter your order id')} />
                    <button className='primary-button'>{t('find order')}</button>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default MyOrder
