import { useState } from 'react'
import { useTranslation } from 'react-i18next';

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import ProductsGrid from '../../components/ProductsGrid'
import ProductCard from '../../components/ProductCard'
import { sampleProducts } from '../../simulateData/data';

const products = sampleProducts;

function Products() {
    const {t} = useTranslation();
  return (
    <div>
        <NavBar />
        <div className='min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center py-20 px-2.5 space-y-10'>
            <div className='flex flex-col text-center lg:space-y-10 justify-center items-center space-y-5'>
                <div className='title'>{t('products')}</div>
                <div className='lg:min-w-[600px] w-[300px] h-[1px] bg-black'></div>
                <div className='lg:text-[24px] lg:text-[24px]'>{t('product page intro')}</div>
                <div className='lg:min-w-[600px] w-[300px] h-[1px] bg-black'></div>
            </div>
            <div className='w-full'><ProductsGrid products={products} /></div>
        </div>
        <Footer/>
    </div>
  );
}

export default Products
