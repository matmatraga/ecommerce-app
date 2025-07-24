import Announcement from '../components/Announcement.js';
import ProductCard from '../components/ProductCard.js';
import { useState, useEffect } from 'react';
import AppNavbar from '../components/AppNavBar.js';
import Newsletter from '../components/Newsletter.js';
import Footer from '../components/Footer.js';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(result => result.json())
      .then(data => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Announcement />
      <AppNavbar />
      <h1 className="text-center mt-3">Products</h1>
      {products.map(product => (
        <ProductCard key={product._id} productProp={product} />
      ))}
      <Newsletter />
      <Footer />
    </>
  );
}
