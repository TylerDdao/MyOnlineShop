// import { createContext, useContext, useState, ReactNode } from 'react';
// import {Order, Customer} from './types'

// type CheckoutContextType = {
//   orderData: Order;
//   setOrderData: React.Dispatch<React.SetStateAction<Order>>;
// };

// // ✅ Initialize context with undefined, but with correct type
// const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
//   const [orderData, setOrderData] = useState<Order>({
//     customer: {
//         name: '',
//         phone: '',
//         email: '',
//     },
//     address: {
//         city: '',
//         cityId: '',
//         district: '',
//         districtId: '',
//         ward: '',
//         wardId: '',
//         street: '',
//     },
//     note: '',
//     payment: 'cash on delivery',
//     subtotal: 0,
//     deliveryFee: 0,
//     id: 0
//   });

//   return (
//     <CheckoutContext.Provider value={{ orderData, setOrderData }}>
//       {children}
//     </CheckoutContext.Provider>
//   );
// };

// export const useCheckout = (): CheckoutContextType => {
//   const context = useContext(CheckoutContext);
//   if (!context) {
//     throw new Error('useCheckout must be used within a CheckoutProvider');
//   }
//   return context;
// };
