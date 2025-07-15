import "../index.css";
import React from 'react';
import ProductCard from "./ProductCard";
import { Product } from "../data/types";


type ProductGridType = {
  products: Product[];
};

const ProductsGrid: React.FC<ProductGridType> = ({
products
}) => {
  return (
    <div className="place-items-center grid lg:gap-y-10 lg:grid-cols-4 grid-cols-2 gap-y-5 gap-x-2.5">
      {products.map((product) => (
        <ProductCard productId={product.id} key={product.id}/>
      ))}
    </div>
  );
};

export default ProductsGrid;
