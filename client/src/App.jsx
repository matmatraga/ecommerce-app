import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { getUserDetails, logout } from './api/auth';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AccountOrders from './pages/AccountOrders';
import ListOrders from './pages/ListOrders';
import AdminDashboard from './pages/AdminDashboard';
import CreateProduct from './pages/CreateProduct';
import UpdateProduct from './pages/UpdateProduct';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import ProductView from './pages/ProductView';

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });

  const loadUser = async () => {
    try {
      const data = await getUserDetails();
      setUser({ id: data._id, isAdmin: data.isAdmin });
    } catch {
      setUser({ id: null, isAdmin: null });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const unsetUser = async () => {
    try {
      await logout();
    } catch {
      // Ignore network/logout errors; clear local state regardless.
    }
    setUser({ id: null, isAdmin: null });
  };

  return (
    <ThemeProvider>
      <UserProvider value={{ user, setUser, unsetUser, refreshUser: loadUser }}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductView />} />
          <Route path="/products/:productId/updateproduct" element={<UpdateProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<ListOrders />} />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
