import { useLocation, Link, Navigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import PaymentInstructions from '../components/PaymentInstructions';
import { formatOrderId, PAYMENT_METHOD_LABEL } from '../utils/orderDisplay';

export default function OrderSuccess() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const order = location.state?.order;

  if (!user.id || user.isAdmin) return <Navigate to="/login" />;

  if (!order) {
    return (
      <>
        <AppNavBar />
        <Container className="my-5 text-center">
          <h1 className="page-title mb-3">Order not found</h1>
          <p className="text-muted mb-4">We could not load your order details.</p>
          <Button as={Link} to="/account/orders" variant="dark" className="me-2">
            View Orders
          </Button>
          <Button as={Link} to="/products" variant="outline-dark">
            Continue Shopping
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppNavBar />
      <Container className="my-5">
        <div className="text-center mb-4">
          <h1 className="page-title">Order Confirmed</h1>
          <p className="page-subtitle">Thank you — we&apos;ve received your order.</p>
        </div>
        <div className="admin-form-card mx-auto" style={{ maxWidth: 480 }}>
          <p className="mb-2"><strong>{formatOrderId(order._id)}</strong></p>
          <p className="text-muted mb-1">Status: {order.status}</p>
          <p className="text-muted mb-1">
            Payment: {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
          </p>
          <p className="mb-3">Total: ₱{Number(order.totalAmount).toFixed(2)}</p>
          <PaymentInstructions order={order} className="mb-3 text-start" />
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <Button as={Link} to="/account/orders" variant="dark">
              View Orders
            </Button>
            <Button as={Link} to="/products" variant="outline-dark">
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
