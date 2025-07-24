import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavBar from './components/AppNavBar.js';
import Home from './pages/Home.js';
import Products from './pages/Products.js';
import Cart from './pages/Cart.js';
import Order from './pages/Order.js';
import ListOrders from './pages/ListOrders.js';
import AdminDashboard from './pages/AdminDashboard.js';
import CreateProduct from './pages/CreateProduct.js';
import UpdateProduct from './pages/UpdateProduct.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Logout from './pages/Logout.js';
import NotFound from './pages/NotFound.js';
import ProductView from './pages/ProductView.js';
import { UserProvider } from './UserContext.js';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });

  const getUserDetails = () => {
    if (localStorage.getItem('token') !== null) {
      fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((result) => result.json())
        .then((data) => {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setUser({ id: null, isAdmin: null });
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  useEffect(() => {

  }, [user]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin/orders" element={<ListOrders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/products/:productId/updateproduct" element={<UpdateProduct />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products/:productId" element={<ProductView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
