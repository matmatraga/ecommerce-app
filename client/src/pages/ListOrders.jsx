import { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Spinner, Badge, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import { getAllOrders, updateOrderStatus } from '../api/orders';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'gcash', label: 'GCash' },
  { value: 'grabpay', label: 'GrabPay' },
  { value: 'qrph', label: 'QRPh' },
];

const statusVariant = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'primary',
  cancelled: 'danger',
  refunded: 'secondary',
};

export default function ListOrders() {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ status: '', paymentMethod: '', sort: 'newest' });

  const { data, isLoading } = useQuery({
    queryKey: ['all-orders', filters],
    queryFn: () => getAllOrders(filters),
    enabled: user.isAdmin === true,
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-orders'] }),
  });

  if (!user.isAdmin) return <Navigate to="/" />;

  const orders = data?.orders ?? [];
  const hasActiveFilters = filters.status || filters.paymentMethod || filters.sort !== 'newest';

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ status: '', paymentMethod: '', sort: 'newest' });

  return (
    <>
      <AppNavBar />
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="page-title mb-1">All Orders</h1>
            <p className="page-subtitle mb-0">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
          <Button as={Link} to="/admin" variant="outline-dark" size="sm">
            ← Back to Dashboard
          </Button>
        </div>

        <div className="search-panel mb-4">
          <Form className="row g-3 align-items-end">
            <div className="col-md-3">
              <Form.Label className="small fw-semibold">Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilter('status', e.target.value)}
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="text-capitalize">{s}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label className="small fw-semibold">Payment method</Form.Label>
              <Form.Select
                value={filters.paymentMethod}
                onChange={(e) => setFilter('paymentMethod', e.target.value)}
              >
                <option value="">All methods</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label className="small fw-semibold">Sort by date</Form.Label>
              <Form.Select
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Button
                type="button"
                variant="outline-secondary"
                className="w-100"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                Reset filters
              </Button>
            </div>
          </Form>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : orders.length ? (
          orders.map((order) => (
            <div key={order._id} className="order-card card mb-3">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                  <div>
                    <span className="text-muted small">Order ID</span>
                    <p className="fw-semibold mb-0 font-monospace small">{order._id}</p>
                  </div>
                  <Badge bg={statusVariant[order.status] || 'secondary'} className="text-capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div className="row g-2 small mb-3">
                  <div className="col-sm-4">
                    <span className="text-muted">Customer</span>
                    <p className="mb-0">{order.userId?.email || order.userId}</p>
                  </div>
                  <div className="col-sm-4">
                    <span className="text-muted">Total</span>
                    <p className="mb-0 fw-semibold">₱{Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <div className="col-sm-4">
                    <span className="text-muted">Date</span>
                    <p className="mb-0">{new Date(order.purchasedOn).toLocaleString()}</p>
                  </div>
                </div>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Update status</Form.Label>
                  <Form.Select
                    size="sm"
                    style={{ maxWidth: 220 }}
                    value={order.status}
                    onChange={(e) =>
                      statusMutation.mutate({ orderId: order._id, status: e.target.value })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h4>{hasActiveFilters ? 'No matching orders' : 'No orders yet'}</h4>
            <p className="text-muted mb-3">
              {hasActiveFilters
                ? 'No orders match the selected filters.'
                : 'Orders will appear here once customers start purchasing.'}
            </p>
            {hasActiveFilters && (
              <Button variant="dark" onClick={resetFilters}>Reset filters</Button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
