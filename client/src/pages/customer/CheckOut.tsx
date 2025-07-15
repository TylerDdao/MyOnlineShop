import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ProductCartList from '../../components/ProductCartList';
import PriceTag from '../../components/PriceTag';
import { ClipLoader } from 'react-spinners';


import { order } from '../../simulateData/data';
import { Address, Order, CartItem } from '../../data/types';
import axios from 'axios';

function CheckOut() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cities, setCities] = useState<Address[]>([]);
  const [districts, setDistricts] = useState<Address[]>([]);
  const [wards, setWards] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
        try {
        setCart(JSON.parse(savedCart))
        
        } catch (error) {
        console.error("Failed to parse cart:", error)
        }
    }
  }, [])

  // 🧩 Load orderData from localStorage initially
  const [orderData, setOrderData] = useState<Order>(() => {
    const saved = localStorage.getItem('order');
    return saved
      ? JSON.parse(saved) as Order
      : {
            customer: { name: '', phone: '', email: null },
            address: {
            city: '', cityId: '', district: '', districtId: '',
            ward: '', wardId: '', street: ''
            },
            payment: 'cash on delivery',
            subtotal: 0,
            deliveryFee: -1,
            note: null,
            id: -1,
            status: 'unknown',
            cart: null,
            total_weight: 0,
            arrival_date: null
        };
  });

  useEffect(()=>{
    if(orderData.id === -1){
      navigate("/")
    }
  }, [])

  // 🪣 Save to localStorage whenever orderData changes
  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(orderData));
  }, [orderData]);

  // 🏙 Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("https://open.oapi.vn/location/provinces?size=999");
        const json = await res.json();
        if (json?.data) setCities(json.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  // 🏘 Fetch districts when cityId changes
  useEffect(() => {
    if (!orderData.address.cityId) return;
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`https://open.oapi.vn/location/districts/${orderData.address.cityId}?size=999`);
        const json = await res.json();
        if (json?.data) setDistricts(json.data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };
    fetchDistricts();
  }, [orderData.address.cityId]);

  // 🏠 Fetch wards when districtId changes
  useEffect(() => {
    if (!orderData.address.districtId) return;
    const fetchWards = async () => {
      try {
        const res = await fetch(`https://open.oapi.vn/location/wards/${orderData.address.districtId}?size=999`);
        const json = await res.json();
        if (json?.data) setWards(json.data);
      } catch (error) {
        console.error("Failed to fetch wards:", error);
      }
    };
    fetchWards();
  }, [orderData.address.districtId]);

    const [cart, setCart] = useState<CartItem[]>([])
    
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0)
  }, [cart])

  const totalWeight = useMemo(() => {
    return cart.reduce((sum, item) => 
      sum + (item.weight ?? 0) * (item.quantity ?? 1), 0
    );
  }, [cart]);

const handleDeliveryFee = async () => {
  try {
    console.log('Fetching shipment fee with params:', {
      weight: orderData.total_weight,
      province: orderData.address.city,
      district: orderData.address.district,
      ward: orderData.address.ward,
      address: orderData.address.street
    });

    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shipment-fee`, {
      params: {
        weight: orderData.total_weight,
        province: orderData.address.city,
        district: orderData.address.district,
        ward: orderData.address.ward,
        address: orderData.address.street
      }
    });

    // Defensive check: make sure fee object and fee.fee exist
    if (response.data?.fee?.fee !== undefined) {
      setOrderData(prev => ({
        ...prev,
        deliveryFee: response.data.fee.fee
      }));
    } else {
      console.warn('fee.fee is missing in response, setting deliveryFee to 0:', response.data);
      setOrderData(prev => ({ ...prev, deliveryFee: 0 }));
    }
  } catch (error) {
    console.error('Failed to fetch shipment fee:', error);
    // Optional: fallback
    setOrderData(prev => ({ ...prev, deliveryFee: 0 }));
  }
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, phone } = orderData.customer;
    const { city, district, ward, street } = orderData.address;
    if (!name || !phone || !city || !district || !ward || !street) {
      alert(t('please fill all the required fields'));
      return;
    }
    setOrderData(prev => ({ ...prev, subtotal: subtotal, total_weight: totalWeight }));
    setIsLoading(true)
    await handleDeliveryFee();
    setIsLoading(false)
    navigate("/payment");
  };

  

  return (
    <div>
      <NavBar />
      {isLoading &&(
        <div id='fetching' className='fixed w-full h-full bg-gray flex flex-col items-center justify-center opacity-50'>
          <ClipLoader
            color="#496287"    // color of the spinner
            loading={true}     // boolean, when true it spins
            size={50}          // size in px
          />
          <div className='h2'>{t('loading')}</div>
        </div>
      )}
      <div className='min-h-screen lg:flex lg:items-center lg:justify-center py-20 px-2.5'>
        <div className='lg:flex lg:flex-col lg:justify-center lg:text-center lg:min-w-[600px] lg:space-y-5'>
          <div className='flex flex-col justify-center text-center space-y-10 mb-10'>
            <div className='title'>{t('check out')}</div>
            <div className='w-full h-[1px] bg-black'></div>
          </div>
          <form className='lg:flex lg:flex-col lg:space-y-5' onSubmit={handleSubmit}>
            <div className='lg:flex lg:items-start lg:text-left lg:space-x-10'>
              <div className='lg:min-w-[400px]'>
                <div className='lg:flex lg:flex-col space-y-5'>
                  <div className='h1'>{t('your contact information')}</div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your name')} <span className='text-tomato_red'>*</span></div>
                    <input type='text' className='w-full' placeholder={t('enter your name')}
                      value={orderData.customer.name}
                      onChange={e => setOrderData(prev => ({
                        ...prev, customer: { ...prev.customer, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your phone number')} <span className='text-tomato_red'>*</span></div>
                    <input type='tel' className='w-full' placeholder={t('enter your phone number')}
                      value={orderData.customer.phone}
                      onChange={e => setOrderData(prev => ({
                        ...prev, customer: { ...prev.customer, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className='lg:flex lg:flex-col lg:space-y-2.5'>
                    <div className='h3'>{t('your email')}</div>
                    <input type='email' className='w-full' placeholder={t('enter your email')}
                      value={orderData.customer.email ?? ''}
                      onChange={e => setOrderData(prev => ({
                        ...prev, customer: { ...prev.customer, email: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <div className='h1'>{t('your delivery address')}</div>
                    <div className='p text-tomato_red'>{t('note: please use the old address before merging')}</div>
                  </div>
                  <div className='flex flex-col space-y-2.5'>
                    <div className='h3'>{t('city')} <span className='text-tomato_red'>*</span></div>
                    <select value={orderData.address.cityId} onChange={e => {
                      const selected = cities.find(c => c.id === e.target.value);
                      setOrderData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          city: selected?.name ?? '',
                          cityId: selected?.id ?? ''
                        }
                      }));
                    }}>
                      <option value='' disabled>{t('select city')}</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col space-y-2.5'>
                    <div className='h3'>{t('district')} <span className='text-tomato_red'>*</span></div>
                    <select value={orderData.address.districtId} onChange={e => {
                      const selected = districts.find(d => d.id === e.target.value);
                      setOrderData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          district: selected?.name ?? '',
                          districtId: selected?.id ?? ''
                        }
                      }));
                    }}>
                      <option value='' disabled>{t('select district')}</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col space-y-2.5'>
                    <div className='h3'>{t('ward')} <span className='text-tomato_red'>*</span></div>
                    <select value={orderData.address.wardId} onChange={e => {
                      const selected = wards.find(w => w.id === e.target.value);
                      setOrderData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          ward: selected?.name ?? '',
                          wardId: selected?.id ?? ''
                        }
                      }));
                    }}>
                      <option value='' disabled>{t('select ward')}</option>
                      {wards.map(ward => (
                        <option key={ward.id} value={ward.id}>{ward.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col space-y-2.5'>
                    <div className='h3'>{t('street number')} <span className='text-tomato_red'>*</span></div>
                    <input type='text' placeholder={t('enter your street name and number')}
                      value={orderData.address.street}
                      onChange={e => setOrderData(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                  </div>

                  <div className='flex flex-col space-y-2.5'>
                    <div className='h3'>{t('note')}</div>
                    <textarea className='lg:min-h-[100px]'
                      value={orderData.note ?? ''}
                      onChange={e => setOrderData(prev => ({
                        ...prev, note: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-10 lg:mt-0'>
                <div className='h1 text-left'>{t('my cart')}</div>
                <div className='flex flex-col space-y-5'>
                    <ProductCartList cartList={cart} />
                    <div className='border border-1'></div>
                    <div className='flex flex-col lg:space-y-2.5'>
                        <div className='h1'>{t('subtotal')}: <PriceTag value={subtotal} /></div>
                        <div className='h2'>{t('delivery fee will be calculated in the next step')}</div>
                    </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center mt-10 lg:mt-0'>
              <button type='submit' className='primary-button h1 min-w-[200px]'>{t('payment')}</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckOut;
