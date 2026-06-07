import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Spinner } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import ProductCard from '../components/ProductCard';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import { getAllProducts } from '../api/products';

const PAGE_SIZE = 12;

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getAllProducts({ page, limit: PAGE_SIZE }),
    enabled: user.isAdmin === true,
    keepPreviousData: true,
  });

  if (user.isAdmin !== true) return <Navigate to="/" />;

  const products = data?.products ?? [];
  const pagination = data?.pagination;
  const stats = data?.stats ?? { total: 0, active: 0, lowStock: 0, outOfStock: 0 };

  const goToPage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshProducts = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] });

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
              <strong>{stats.total}</strong>
              Total products
            </div>
            <div className="admin-stat">
              <strong>{stats.active}</strong>
              Active
            </div>
            <div className="admin-stat">
              <strong>{stats.lowStock}</strong>
              Low stock
            </div>
            <div className="admin-stat">
              <strong>{stats.outOfStock}</strong>
              Out of stock
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : products.length ? (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  productProp={product}
                  onUpdated={refreshProducts}
                />
              ))}
            </div>
            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onChange={goToPage}
              />
            )}
          </>
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
