import { useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Button, Spinner, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import Announcement from '../components/Announcement';
import AppNavBar from '../components/AppNavBar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import { getCart, updateQuantities, clearCart } from '../api/cart';

export default function Cart() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user.id && !user.isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: updateQuantities,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const updateQty = (productId, quantity) => {
    updateMutation.mutate([{ productId, quantity }]);
  };

  if (!user.id || user.isAdmin) {
    return <Navigate to="/login" />;
  }

  const cart = data?.cart;
  const total = data?.total ?? 0;
  const tax = total * 0.12;
  const shipping = cart?.products?.length ? 40 : 0;
  const grandTotal = total + tax + shipping;

  return (
    <>
      <Announcement />
      <AppNavBar />
      <Container className="py-5">
        <div className="text-center mb-4">
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">
            {cart?.products?.length
              ? `${cart.products.length} item${cart.products.length > 1 ? 's' : ''} in your cart`
              : 'Review your items before checkout'}
          </p>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : cart?.products?.length ? (
          <div className="row g-4">
            <div className="col-lg-8">
              {cart.products.map((item) => (
                <div key={item.productId._id} className="cart-item card mb-3">
                  <div className="card-body d-flex flex-wrap align-items-center gap-3">
                    <ProductImage
                      src={item.productId.img}
                      alt={item.productId.name}
                      variant="thumb"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{item.productId.name}</h6>
                      <p className="text-muted mb-0 small">₱{item.productId.price} each</p>
                    </div>
                    <Form.Select
                      style={{ width: 80 }}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQty(item.productId._id, Number(e.target.value))
                      }
                    >
                      {Array.from(
                        { length: Math.min(item.productId.stock, 10) },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => updateQty(item.productId._id, 0)}
                    >
                      Remove
                    </Button>
                    <strong className="ms-auto">₱{item.subtotal.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="cart-summary sticky-top" style={{ top: 80 }}>
                <h5 className="fw-semibold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax (12%)</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span>₱{shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong className="fs-5 text-accent">
                    ₱{grandTotal.toFixed(2)}
                  </strong>
                </div>
                <Button variant="dark" className="w-100 mb-2" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🛒</div>
            <h4>Your cart is empty</h4>
            <p className="text-muted mb-3">Browse our products and add something refreshing!</p>
            <Button as={Link} to="/products" variant="dark">
              Shop Products
            </Button>
          </div>
        )}
      </Container>
      <Newsletter />
      <Footer />
    </>
  );
}
