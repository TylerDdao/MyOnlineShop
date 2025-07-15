export interface Address{
  id: string | undefined,
  name: string | undefined
}

export interface Customer {
  name: string;
  phone: string;
  email: string | null;
}

export interface AddressData {
  city: string;
  cityId: string
  district: string;
  districtId: string;
  ward: string;
  wardId: string;
  street: string;
}

export type Variant = {
  id: string;
  name: string;
}

export type Attribute = {
  id: string;
  value: string;
  variant: Variant;
}

export type Combination_Product = {
  attribute: Attribute[];
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  description: string,
  price: number;
  number_images: number;
  combinations: Combination_Product[];
  weight: number;
};

export type CartItem = {
  productId: string;
  productName:string
  quantity: number;
  selectedAttributes: {
    [variantType: string]: string;
  };
  price: number;
  weight: number;
};


export type Order = {
  customer: Customer;
  address: AddressData;
  id: number | null;
  payment: 'cash on delivery' | 'bank transfer';
  subtotal: number;
  deliveryFee: number | null;
  note: string | null;
  status: string | null;
  cart: CartItem[] | null;
  total_weight: number ;
  arrival_date?: string | null; // Optional field for estimated arrival date
};

export type ShipmentFeeResponse = {
  success: boolean;
  fee: {
    name: string;
    fee: number;
    insurance_fee: number;
    include_vat: number;
    cost_id: number;
    delivery_type: string;
    a: number;
    dt: string;
    extFees: any[];
    promotion_key: string;
    delivery: boolean;
    ship_fee_only: number;
    distance: number;
    options: {
      name: string;
      title: string;
      shipMoney: number;
      shipMoneyText: string;
      vatText: string;
      desc: string;
      coupon: string;
      maxUses: number;
      maxDates: number;
      maxDateString: string;
      content: string;
      activatedDate: string;
      couponTitle: string;
      discount: string;
      couponId: number;
    }
  };
  message: string;
};