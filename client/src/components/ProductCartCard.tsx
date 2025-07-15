import "../index.css";
import React from 'react';
import { useTranslation } from 'react-i18next';
import PriceTag from './PriceTag';
import { BsFillTrash3Fill } from "react-icons/bs";
import { CartItem } from "../data/types";
import { Link } from "react-router-dom";

type ProductCartCardProps = {
  cartItem: CartItem;
  removeable?: boolean;
  url?: string;
  onRemove?: (id: string, selectedAttributes: { [variantType: string]: string }) => void;
};

const ProductCartCard: React.FC<ProductCartCardProps> = ({
  cartItem,
  removeable = false,
  url = '#',
  onRemove = () => {},
}) => {
  const { t } = useTranslation();
  const totalPrice = cartItem.price * cartItem.quantity;

  return (
    <Link to={url} className="block w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 text-left">
          <img src={`/images/products/${cartItem.productId}/1.jpg`} className='w-auto max-h-[100px] ' alt={cartItem.productName} />
          <div className="lg:flex lg:flex-col lg:ml-2.5">
            <div className="lg:text-[24px]">{cartItem.productName}</div>
            <div><PriceTag value={cartItem.price} className='h3 text-deep_blue'/> * {cartItem.quantity}</div>
            {/* show selected attributes */}
            <ul>
              {Object.entries(cartItem.selectedAttributes).map(([variantType, value]) => (
                <li key={variantType} className="p">{t(variantType)}: {value}</li>
              ))}
            </ul>
            <ul>
              <li className="p">{t('quantity')}: {cartItem.quantity}</li>
            </ul>
          </div>
        </div>
        <PriceTag value={totalPrice} className='h1 text-deep_blue' />
        {removeable && (
          <button onClick={() => onRemove(cartItem.productId, cartItem.selectedAttributes)}>
            <BsFillTrash3Fill aria-label="Remove Item" className="w-auto lg:h-[25px] fill-tomato_red" />
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCartCard;
