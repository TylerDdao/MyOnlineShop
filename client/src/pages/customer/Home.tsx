import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

function Home() {
    const {t} = useTranslation();
    return (
        <div>
        <NavBar />
        <div className='min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center py-20 space-y-20'>
            <div className='lg:flex lg:flex-col space-y-10 lg:mb-20 justify-center text-center lg:min-w-[600px]'>
                <div className='title'>{t('welcome to the store')}</div>
                <div className='h1-b'>{t('home paragraph 1')}</div>
                <div><Link to={'/products'}><button className='primary-button py-1 min-w-[200px] h1-b'>{t('shop now')}</button></Link></div>
            </div>
            <img src='/images/vertical.jpg' className='lg:max-w-[1000px] lg:max-h-[600px]'/>
        </div>
        <Footer />
        </div>
    )
}

export default Home
