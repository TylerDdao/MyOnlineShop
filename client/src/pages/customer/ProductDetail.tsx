import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsArrowLeft, BsPlusLg, BsDashLg  } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import PriceTag from '../../components/PriceTag'

import { product } from '../../simulateData/data'
import { Product, CartItem } from '../../data/types'

import HorizontalImageSlider from '../../components/HorizontalImageSlider'

function ProductDetail() {
    const { t } = useTranslation()
    // const productDetail: Product = product
    const [quantity, setQuantity] = useState<number>(1)
    const [maxQuantity, setMaxQuantity] = useState<number | null>(null)
    const [missingVariants, setMissingVariants] = useState<string[]>([]);
    const [productDetail, setProductDetail] = useState<Product>(product);
    const [stock, setStock] = useState<number | null>(null);

    useEffect(()=>{
        const product = localStorage.getItem("productDetail")
        if(product){
            setProductDetail(JSON.parse(product) as Product)
        }
    }, [])
   
    // Find unique variant types (e.g., Color, Size)
    const variantTypes = Array.from(
    new Set(
        productDetail.combinations.flatMap(comb =>
        comb.attribute.map(attr => attr.variant.name)
        )
    )
    )

    // Selected variant values
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({})

    const addToCart = (e) => {
        e.preventDefault();
        const missing = variantTypes.filter(type => !selectedAttributes[type]);
        if(Object.keys(selectedAttributes).length==(Object.keys(variantTypes).length)){
            setMissingVariants([]);
            // Create new cart item with selected options
            const cartItem: CartItem = {
                productId: productDetail.product_id,
                productName: productDetail.product_name,
                quantity: quantity,
                selectedAttributes: selectedAttributes,   // add this!
                price: productDetail.price,             // optional: store price at time of adding
                weight: product.weight * quantity
            };

            // Load existing cart
            const existingCartJson = localStorage.getItem('cart');
            let existingCart: CartItem[] = existingCartJson ? JSON.parse(existingCartJson) : [];

            // Check if the same product with same selectedAttributes is already in cart
            const existingItemIndex = existingCart.findIndex(item =>
                item.productId === cartItem.productId &&
                JSON.stringify(item.selectedAttributes) === JSON.stringify(cartItem.selectedAttributes)
            );

            if (existingItemIndex !== -1) {
                // If it exists, increase quantity
                existingCart[existingItemIndex].quantity += cartItem.quantity;
            } else {
                // Else, add new item
                existingCart.push(cartItem);
            }

            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(existingCart));
            alert(t('added to cart'));
        }
        else{
            setMissingVariants(missing);
            alert(t("please select variant"))
        }
        
    };

    const handleVariantChange = (e, variantType) => {
        e.preventDefault();
        setSelectedAttributes(prev => ({
        ...prev,
        [variantType]: e.target.value
        }));
        setMissingVariants([])
    }

    useEffect(() => {
        const matchedCombination = productDetail.combinations.find(combination => {
            return combination.attribute.every(attr => {
                const variantName = attr.variant.name;
                return selectedAttributes[variantName] === attr.value;
            });
        });

        if (matchedCombination) {
            setStock(matchedCombination.stock);
            // also, update maxQuantity
            setMaxQuantity(matchedCombination.stock);
            // if current quantity is more than stock, reset:
            setQuantity(q => Math.min(q, matchedCombination.stock));
            if(quantity==0 && matchedCombination.stock > 0){
                setQuantity(1);
            }
        } else {
            setStock(null);
            setMaxQuantity(null);
        }
    }, [selectedAttributes]);

    return (
    <div>
        <NavBar />
        <div className='min-h-screen flex flex-col items-center justify-center py-20'>
        <div className='lg:min-w-[600px]'>
            <div className='mb-5'>
                <Link to='/products'>
                    <button className='primary-button flex items-center space-x-2.5 min-w-[200px] p-2.5'>
                        <BsArrowLeft className='h-[25px] w-[25px]' />
                        <span>{t('back')}</span>
                    </button>
                </Link>
            </div>
            <form>
            <div className='lg:flex lg:space-x-5'>
            <HorizontalImageSlider productId={productDetail.product_id} numberOfImage={productDetail.number_of_images}/>
            <div className='flex flex-col space-y-2.5'>
                <div>
                    <div className='title'>{productDetail.product_name}</div>
                    {stock !== null && (
                        stock === 0 ? (
                                <div className='text-gray'>{t('out of stock')}</div>
                            ) : stock <= 5 ? (
                                <div className='text-tomato_red'>{t('few left')}: {stock}</div>
                            ) : (
                                <div>{t('product left')}: {stock}</div>
                            )
                        )}
                </div>
                <div className='h1 text-deep_blue'>
                <PriceTag value={productDetail.price} />
                </div>
                <div className='p'>{productDetail.description}</div>

                    {/* Variant options as <select> */}
                    {variantTypes.map(variantType => {
                    const options = Array.from(
                        new Set(
                        productDetail.combinations.flatMap(comb =>
                            comb.attribute
                            .filter(attr => attr.variant.name === variantType)
                            .map(attr => attr.value)
                        )
                        )
                    )

                    return (
                        <div key={variantType} className='flex flex-col space-y-1'>
                            <div className='h3'>{t(variantType)}</div>
                            <select
                                id={`variant`}
                                value={selectedAttributes[variantType] || ''}
                                onChange={e =>{handleVariantChange(e, variantType)}}
                                className={`border p-1 ${missingVariants.includes(variantType) ? 'border-red-500' : ''}`}
                            >
                                <option value='' disabled>{t('select')} {variantType}</option>
                                {options.map(value => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                                ))}
                            </select>
                        </div>
                    )
                    })}

                <div className='h3'>{t('quantity')}</div>
                <div className='lg:flex lg:space-x-2.5 items-center justify-around'>
                <button type='button' onClick={() => setQuantity(q => {if ((!maxQuantity || q < maxQuantity) && q>1) return q - 1;return q;})}><BsDashLg className='w-auto lg:h-5'/></button>
                <input disabled={stock==0} value={stock != 0 ? quantity : "n/a"} min={stock != 0 ? 1 : 0} className={`text-center h3 ${stock == 0 ? 'text-gray' : 'text-black'}`} onChange={e => {const val = Number(e.target.value); if (val >= 1) setQuantity(val); }}/>
                <button type='button' onClick={() => setQuantity(q => {if (!maxQuantity || q < maxQuantity) return q + 1;return q;})} disabled={maxQuantity !== null && quantity >= maxQuantity}><BsPlusLg className='w-auto lg:h-5'/></button>
                </div>

                <button className='primary-button p-2.5' onClick={addToCart} disabled={stock == 0}>{t('add to cart')}</button>
            </div>
            
            </div>
            </form>
        </div>
        
        </div>
        <Footer />
    </div>
    )
}

export default ProductDetail

