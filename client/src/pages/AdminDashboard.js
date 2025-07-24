import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import UserContext from '../UserContext';
import ProductCard from '../components/ProductCard';
import AppNavBar from '../components/AppNavBar';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/allproducts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.map(product => {
          return (
            <ProductCard key={product._id} productProp={product} onActivate={() => {
              archive(product._id, true)
            }} onDisable={() => {
              archive(product._id, false)
            }} />
          )
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCreateProduct = () => {
    navigate('/createProduct')
  };

  return user.isAdmin === true ? (
    <>
      <AppNavBar />
      <div>
        <h1 className="text-center mt-3">Admin Dashboard</h1>
        <div className="d-flex justify-content-center m-3">
          <Button variant="primary" className="me-2" onClick={handleCreateProduct}>
            Create New Product
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/orders')}>
            Show User Orders
          </Button>
        </div>
        {products}
      </div>
    </>
  ) : (
    <Navigate to="/notFound" />
  );
}
