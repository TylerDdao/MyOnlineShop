import "../index.css";
import React from 'react';
import ProductCard from "./ProductCard";
import { Product } from "../data/types";
import { useTranslation } from "react-i18next";

type ProductGridType = {
  products: Product[];
};

const ProductsGrid: React.FC<ProductGridType> = ({ products }) => {
  const {t} = useTranslation();
  if(products.length>0){
    return (
      <div className="place-items-center grid lg:gap-y-10 lg:grid-cols-4 grid-cols-2 gap-y-5 gap-x-2.5">
          {products.map((product) => (
            <ProductCard productId={product.product_id} key={product.product_id} />
          ))}
      </div>
    );
  }
  else{
    return(
        <div className="flex flex-col justify-center items-center w-full">
          <div className="h1 text-deep_blue">{t('no result')}</div>
        </div>
    )
  }
};

export default ProductsGrid;

