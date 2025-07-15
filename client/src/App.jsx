// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/customer/Home.js';
// import Sample from './pages/Sample.jsx';
// import Translate from './pages/Translate.jsx';
// import Products from './pages/customer/Products.js';
// import MyOrder from './pages/customer/MyOrder.js';
// import OrderDetail from './pages/customer/OrderDetail.js';
// import MyCart from './pages/customer/MyCart.js';
// import CheckOut from './pages/customer/CheckOut.js';
// import Payment from './pages/customer/Payment.js';
// import BankTransfer from './pages/customer/BankTransfer.js';
// import Confirm from './pages/customer/Confirm.js';
// import ProductDetail from './pages/customer/ProductDetail.js'

// import {CheckoutProvider} from './data/contexts.js'

// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:productId" element={<ProductDetail />} />
//         <Route path="/my-order" element={<MyOrder />} />
//         <Route path="/my-order/:orderId" element={<OrderDetail />} />
//         <Route path="/my-cart" element={<MyCart />} />
//         <Route element={
//           <CheckoutProvider>
//             <Routes>
//               <Route path="/check-out" element={<CheckOut />} />
//               <Route path="/payment" element={<Payment />} />
//               <Route path="/bank-transfer" element={<BankTransfer />} />
//               <Route path="/confirm" element={<Confirm />} />
//             </Routes>
//           </CheckoutProvider>
//         } />
//         <Route path="/translate" element={<Translate />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from 'react-router-dom';
import Home from './pages/customer/Home.js';
import Sample from './pages/Sample.jsx';
import Translate from './pages/Translate.jsx';
import Products from './pages/customer/Products.js';
import MyOrder from './pages/customer/MyOrder.js';
import OrderDetail from './pages/customer/OrderDetail.js';
import MyCart from './pages/customer/MyCart.js';
import CheckOut from './pages/customer/CheckOut.js';
import Payment from './pages/customer/Payment.js';
import BankTransfer from './pages/customer/BankTransfer.js';
import Confirm from './pages/customer/Confirm.js';
import ProductDetail from './pages/customer/ProductDetail.js';
// import CheckoutLayout from './CheckOutLayout.tsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/sample" element={<Sample />} />

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/my-order/:orderId" element={<OrderDetail />} />
        <Route path="/my-cart" element={<MyCart />} />
        <Route path="/check-out" element={<CheckOut />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/bank-transfer" element={<BankTransfer />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/translate" element={<Translate />} />
      </Routes>
    </div>
  );
}

export default App;
