import { Carousel, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserContext from '../context/UserContext';
import { getActiveProducts } from '../api/products';
import ProductImage from './ProductImage';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export default function Highlight() {
  const { user } = useContext(UserContext);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const res = await getActiveProducts();
      return (res.products ?? []).slice(0, 4);
    },
  });

  if (isLoading) {
    return (
      <div className="carousel-highlight carousel-highlight--fixed d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <section className="carousel-highlight carousel-highlight--fixed hero-fallback d-flex align-items-center">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">ASTER Gaming</h1>
          <p className="lead text-muted mb-4">
            Premium gaming peripherals — keyboards, mice, headsets, and more.
          </p>
          {!user.isAdmin && (
            <Button as={Link} to="/products" variant="dark" size="lg" className="px-4">
              Browse Products
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <Carousel
      className="carousel-highlight carousel-highlight--fixed"
      aria-label="Featured products"
      aria-roledescription="carousel"
      interval={prefersReducedMotion ? null : 5000}
      pause="hover"
    >
      {products.map((product) => (
        <Carousel.Item key={product._id} className="hero-slide">
          <div className="container-fluid hero-slide__inner">
            <div className="row align-items-center g-3 g-md-4 h-100">
              <div className="col-md-7 col-lg-7 hero-slide__media">
                <ProductImage src={product.img} alt={product.name} variant="hero" />
              </div>
              <div className="col-md-5 col-lg-5 hero-slide__copy px-md-3 text-center text-md-start">
                <p className="text-uppercase small fw-semibold text-muted mb-2">
                  {product.category}
                </p>
                <h1 className="display-5 fw-bold hero-slide__title">{product.name}</h1>
                <p className="lead my-3 hero-slide__desc">{product.description}</p>
                {!user.isAdmin && (
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                    <Button
                      as={Link}
                      to={`/products/${product._id}`}
                      variant="dark"
                      size="lg"
                      className="px-4"
                    >
                      View Product
                    </Button>
                    <Button as={Link} to="/products" variant="outline-dark" size="lg">
                      All Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
