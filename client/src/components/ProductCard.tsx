import "../index.css";
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import PriceTag from './PriceTag';
import { Product } from "../data/types";

import axios from "axios";

type ProductType = {
  productId: string;
};

const ProductCardCopy: React.FC<ProductType> = ({
productId
}) => {
  const { t } = useTranslation();
  const [productDetail, setProductDetail] = React.useState<Product | null>();
  const handleGetProductDetail = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product-detail`, {
      params: {
        productId: productId
      }
    })
    if(res.status === 200) {
      setProductDetail(res.data);      
    }
  }

  useEffect(()=>{
    localStorage.removeItem("productDetail");
    handleGetProductDetail();
  }, [])

  const handleClick =() => {
    console.log("Product clicked:", productDetail);
    localStorage.setItem('productDetail', JSON.stringify(productDetail));
  }

  return (
    <Link to={`/products/${productDetail?.id}`} onClick={()=>handleClick()}>
      <div id={`${productDetail?.id}`} className="w-[150px] lg:w-[300px]">
      <img src={`/images/products/${productDetail?.id}/1.jpg`} className='w-max h-auto'/>
      <div className='text-black lg:text-[24px] p'>{productDetail?.name}</div>
      <PriceTag value={productDetail?.price} className='lg:h2 h3 text-deep_blue'/>
      </div>
      <button className="primary-button w-full">{t('detail')}</button>
    </Link>
  );
};

export default ProductCardCopy;
