import './index.css'

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
import Login from './pages/admin/Login.js';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashBoard from './pages/admin/dashboard.js';
import OrderManagement from './pages/admin/OrderManagement.js';
import AdminOrderDetail from './pages/admin/AdminOrderDetail.js';
import Error from './pages/Error.js';
// import CheckoutLayout from './CheckOutLayout.tsx';

function App() {
  return (
    <div>
      <AuthProvider>
      <Routes>
        <Route path="/sample" element={<Sample />} />
        <Route path="/translate" element={<Translate />} />

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

        <Route path="/error" element={<Error/>}/>

        <Route path='/admin/login' element={<Login/>}/>
        <Route path='/admin/order-management' element={<OrderManagement/>}/>
        <Route path='/admin/order-management/:orderId' element={<AdminOrderDetail/>}/>
        <Route path='/admin/dashboard' element={<DashBoard/>}/>

        {/* <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          /> */}
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
