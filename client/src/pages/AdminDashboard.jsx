import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Spinner } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import ProductCard from '../components/ProductCard';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import { getAllProducts } from '../api/products';

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProducts,
    enabled: user.isAdmin === true,
  });

  if (user.isAdmin !== true) return <Navigate to="/" />;

  const products = data?.products ?? [];
  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <>
      <AppNavBar />
      <div className="container py-5">
        <div className="admin-header">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <h1 className="page-title mb-1">Admin Dashboard</h1>
              <p className="page-subtitle mb-0">Manage your product catalog and inventory</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="dark" onClick={() => navigate('/createProduct')}>
                + Create Product
              </Button>
              <Button variant="outline-dark" onClick={() => navigate('/admin/orders')}>
                Manage Orders
              </Button>
            </div>
          </div>
          <div className="admin-stats">
            <div className="admin-stat">
              <strong>{products.length}</strong>
              Total products
            </div>
            <div className="admin-stat">
              <strong>{activeCount}</strong>
              Active
            </div>
            <div className="admin-stat">
              <strong>{lowStockCount}</strong>
              Low stock
            </div>
            <div className="admin-stat">
              <strong>{outOfStockCount}</strong>
              Out of stock
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                productProp={product}
                onUpdated={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h4>No products yet</h4>
            <p className="text-muted mb-3">Create your first product to get started.</p>
            <Button variant="dark" onClick={() => navigate('/createProduct')}>
              Create Product
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
