import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function Error() {
    const {t} = useTranslation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    return (
        <div>
        <NavBar />
        <div className='min-h-screen flex flex-col items-center justify-center py-20 space-y-5'>
            <div className='title text-deep_blue'>{code}</div>
            <div className='h1-b'>{message}</div>
            <Link to={`/`}><button className='primary-button min-w-[200px]'>{t('return')}</button></Link>
        </div>
        <Footer />
        </div>
    )
}

export default Error
