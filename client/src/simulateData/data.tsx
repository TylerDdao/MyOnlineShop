import { Product, Order , CartItem} from "../data/types";


export let customer = {
    name: "John Doe",
    email: "john@gmail.com",
    phone: "0123456789",
    address: {
        city: "Hanoi",
        district: "Dong Da",
        ward: "Trung Liet",
        streetNumber: "123 Nguyen Trai"
    },
    note: "Please deliver before 5 PM",
};

export let variants = [
  {
    id: 1,
    name: "Size",
    attribute: [
      { value: "S" },
      { value: "M" },
      { value: "L" }
    ]
  },
  {
    id: 2,
    name: "Color",
    attribute: [
      { value: "Black" },
      { value: "Blue" },
      { value: "Red" },
      { value: "Green" }
    ]
  },
  {
    id: 3,
    name: "Version",
    attribute: [
      { value: "1.0" },
      { value: "2.0" },
      { value: "3.0" }
    ]
  }
];

// export let product = {
//   id: 1,
//   name: 'Product 1',
//   description: 'This is a description',
//   image: '/images/pic1.jpg',
//   price: '1000000',
//   quantity: 1,
//   variant1: "Size",
//   variant1_attributes: ["S", "M", "L"],
//   variant2: "Color",
//   variant2_attributes: ["Blue", "Red", "Green"]
// };

// variants.filter(v=> v.name=="Size" || v.name == "Color").map(variant => variant.name)
export const sampleProducts: Product[] = [
  {
    product_id: '1',
    product_name: 'Classic T-Shirt',
    description: 'A comfortable cotton t-shirt perfect for everyday wear.',
    price: 19.99,
    number_of_images: 3,
    combinations: [
      {
        attribute: [
          { id: 'color-red', value: 'Red', variant: { id: 'v-color', name: 'Color' } },
          { id: 'size-m', value: 'M', variant: { id: 'v-size', name: 'Size' } },
        ],
        stock: 50,
      },
      {
        attribute: [
          { id: 'color-blue', value: 'Blue', variant: { id: 'v-color', name: 'Color' } },
          { id: 'size-l', value: 'L', variant: { id: 'v-size', name: 'Size' } },
        ],
        stock: 30,
      },
    ],
    weight: 0.5
  },
  {
    product_id: '2',
    product_name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life.',
    price: 29.99,
    number_of_images: 4,
    combinations: [
      {
        attribute: [
          { id: 'color-black', value: 'Black', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 100,
      },
      {
        attribute: [
          { id: 'color-white', value: 'White', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 80,
      },
    ],
    weight: 0.5
  },
  {
    product_id: '3',
    product_name: 'Stainless Steel Water Bottle',
    description: 'Keeps your drinks hot or cold for up to 12 hours.',
    price: 15.99,
    number_of_images: 2,
    combinations: [
      {
        attribute: [
          { id: 'capacity-500ml', value: '500ml', variant: { id: 'v-capacity', name: 'Capacity' } },
        ],
        stock: 60,
      },
      {
        attribute: [
          { id: 'capacity-750ml', value: '750ml', variant: { id: 'v-capacity', name: 'Capacity' } },
        ],
        stock: 40,
      },
    ],
    weight: 0.5
  },
  {
    product_id: '4',
    product_name: 'Bluetooth Headphones',
    description: 'Noise-cancelling headphones with clear sound quality.',
    price: 59.99,
    number_of_images: 5,
    combinations: [
      {
        attribute: [
          { id: 'color-black', value: 'Black', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 25,
      },
      {
        attribute: [
          { id: 'color-gray', value: 'Gray', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 15,
      },
    ],
    weight: 0.5
  },
  {
    product_id: '5',
    product_name: 'Leather Wallet',
    description: 'Slim and stylish leather wallet with multiple compartments.',
    price: 24.99,
    number_of_images: 3,
    combinations: [
      {
        attribute: [
          { id: 'color-brown', value: 'Brown', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 40,
      },
      {
        attribute: [
          { id: 'color-black', value: 'Black', variant: { id: 'v-color', name: 'Color' } },
        ],
        stock: 35,
      },
    ],
    weight: 0.5
  },
];



export const product: Product = {
  product_id: "1",
  product_name: "T-Shirt",
  price: 250000,
  description: "This is a good product that you should have!!",
  number_of_images: 3,
  combinations: [
    {
      stock: 10,
      attribute: [
        {
          id: "attr-001",
          value: "Blue",
          variant: {
            id: "var-001",
            name: "color"
          }
        },
        {
          id: "attr-002",
          value: "M",
          variant: {
            id: "var-002",
            name: "size"
          }
        }
      ]
    },
    {
      stock: 5,
      attribute: [
        {
          id: "attr-003",
          value: "Red",
          variant: {
            id: "var-001",
            name: "color"
          }
        },
        {
          id: "attr-004",
          value: "M",
          variant: {
            id: "var-002",
            name: "size"
          }
        }
      ]
    },
    {
      stock: 0,
      attribute: [
        {
          id: "attr-001",
          value: "Blue",
          variant: {
            id: "var-001",
            name: "color"
          }
        },
        {
          id: "attr-005",
          value: "L",
          variant: {
            id: "var-002",
            name: "size"
          }
        }
      ]
    }
  ],
  weight: 0.5
};

const cartItems: CartItem[] = [
  {
    productId: '1',
    productName: 'Classic White T-Shirt',
    quantity: 2,
    selectedAttributes: {
      Size: 'M',
      Color: 'White'
    },
    price: 19.99,
    weight: 1
  },
  {
    productId: '2',
    productName: 'Blue Denim Jeans',
    quantity: 1,
    selectedAttributes: {
      Size: '32',
      Fit: 'Slim'
    },
    price: 49.99,
    weight: 0.5
  }
];


export const order: Order = {
  id: 1,
  customer: {
    name: "Tyler Dao",
    phone: "0964243434",
    email: "baonam6a3@gmail.com",
  },
  address: {
    city: "Hanoi",
    cityId: "01",
    district: "Ba Dinh",
    districtId: "001",
    ward: "Phuc Xa",
    wardId: "00001",
    street: "123 Pho Hue Street",
  },
  payment: "cash on delivery",   // or "bank transfer"
  subtotal: 1500000,             // for example: 1,500,000 VND
  deliveryFee: 30000,            // e.g., 30,000 VND
  note: "Please call me before delivery",
  status: "in process",
  cart: cartItems,
  total_weight: 0,
  arrival_date: "2025-7-01"
};