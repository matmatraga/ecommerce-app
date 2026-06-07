import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Form, Button, Spinner } from 'react-bootstrap';
import Announcement from '../components/Announcement';
import ProductCard from '../components/ProductCard';
import AppNavBar from '../components/AppNavBar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { getActiveProducts, searchByName, searchByPrice } from '../api/products';
import { CATEGORIES } from '../data';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', category, search, minPrice, maxPrice],
    queryFn: async () => {
      if (search) {
        const res = await searchByName(search);
        return res.products;
      }
      if (minPrice || maxPrice) {
        const res = await searchByPrice(minPrice, maxPrice);
        return res.products;
      }
      const res = await getActiveProducts(category ? { category } : {});
      return res.products;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <>
      <Announcement />
      <AppNavBar />
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">Keyboards, mice, headsets, and gear built for competitive play</p>
        </div>

        <div className="search-panel">
          <Form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-3">
              <Form.Label className="small fw-semibold">Search</Form.Label>
              <Form.Control
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="small fw-semibold">Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Label className="small fw-semibold">Min price</Form.Label>
              <Form.Control
                type="number"
                placeholder="₱0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Label className="small fw-semibold">Max price</Form.Label>
              <Form.Control
                type="number"
                placeholder="₱999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <Button type="submit" variant="dark" className="flex-grow-1">
                Search
              </Button>
              <Button type="button" variant="outline-secondary" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </Form>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : data?.length ? (
          <div className="product-grid">
            {data.map((product) => (
              <ProductCard key={product._id} productProp={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h4>No products found</h4>
            <p className="text-muted mb-3">Try adjusting your search or filters.</p>
            <Button variant="dark" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
