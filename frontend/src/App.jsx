import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import ProductDetail from './pages/buyer/ProductDetail';
import MyOrders from './pages/buyer/MyOrders';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import VendorProducts from './pages/vendor/VendorProducts';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Routes>

      {/* ✅ PUBLIC — bina login browse karo */}
      <Route path="/"           element={<BuyerDashboard />} />
      <Route path="/buyer"      element={<BuyerDashboard />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/register"   element={<Register />} />

      {/* 🔒 BUYER — login ke baad */}
      <Route path="/cart" element={
        <PrivateRoute allowedRoles={['BUYER']}>
          <Cart />
        </PrivateRoute>
      }/>
      <Route path="/checkout" element={
        <PrivateRoute allowedRoles={['BUYER']}>
          <Checkout />
        </PrivateRoute>
      }/>
      <Route path="/orders" element={
        <PrivateRoute allowedRoles={['BUYER']}>
          <MyOrders />
        </PrivateRoute>
      }/>

      {/* 🏪 VENDOR — login ke baad */}
      <Route path="/vendor" element={
        <PrivateRoute allowedRoles={['VENDOR']}>
          <VendorDashboard />
        </PrivateRoute>
      }/>
      <Route path="/vendor/products" element={
        <PrivateRoute allowedRoles={['VENDOR']}>
          <VendorProducts />
        </PrivateRoute>
      }/>

      {/* ⚙️ ADMIN */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['ADMIN']}>
          <h1 style={{textAlign:'center', marginTop:'2rem'}}>
            Welcome Admin! ⚙️
          </h1>
        </PrivateRoute>
      }/>

    </Routes>
  );
}