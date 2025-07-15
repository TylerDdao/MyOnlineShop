import "../index.css";
import ProductCartCard from "./ProductCartCard";
import { CartItem } from "../data/types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  cartList: CartItem[];
  onRemove?: (id: string, selectedAttributes: { [variantType: string]: string }) => void;
  removeable?: boolean;
  onClear?: ()=>void;
};

const ProductCartList: React.FC<Props> = ({ cartList, onRemove = () => {},removeable=false, onClear = () => {} }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  return (
    <div id='items-list' className='overflow-y-scroll lg:max-h-[500px]'>
      {cartList.length === 0 ? (
        <div>
          <div className='h2'>{t('your cart is empty')}</div>
          <button
                className='secondary-button h1 min-w-[200px]'
                onClick={() => navigate('/products')}
            >
                {t('continue shopping')}
            </button>
        </div>
      ) : (
        cartList.map((item, index) => (
          <div key={index} className='lg:my-2.5 flex flex-col items-center mt-2.5'>
            {index > 0 && <div className="w-[300px] border border-gray "></div>}
            <ProductCartCard
              cartItem={item}
              removeable={removeable}
              onRemove={onRemove}
            />
          </div>
        ))
      )}
      {removeable ? (
        <div className="lg:flex lg:justify-end"><button className="secondary-button h3" onClick={onClear}>{t('clear cart')}</button></div>
      ):(
        <div></div>
      )}
    </div>
  );
};

export default ProductCartList;
