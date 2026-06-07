import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Spinner, Badge, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import { getAllOrders, updateOrderStatus } from '../api/orders';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];

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

  const { data, isLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: getAllOrders,
    enabled: user.isAdmin === true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-orders'] }),
  });

  if (!user.isAdmin) return <Navigate to="/" />;

  const orders = data?.orders ?? [];

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
                    <p className="mb-0 fw-semibold">₱{order.totalAmount}</p>
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
            <h4>No orders yet</h4>
            <p className="text-muted">Orders will appear here once customers start purchasing.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
