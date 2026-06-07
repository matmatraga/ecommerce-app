import { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/cart';
import { createOrder } from '../api/orders';

const emptyAddress = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'Philippines',
};

export default function Checkout() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user.id && !user.isAdmin,
  });

  if (!user.id || user.isAdmin) return <Navigate to="/login" />;

  const total = cartData?.total ?? 0;
  const tax = total * 0.12;
  const shipping = cartData?.cart?.products?.length ? 40 : 0;
  const grandTotal = total + tax + shipping;

  const handleField = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartData?.cart?.products?.length) {
      Swal.fire({ title: 'Cart empty', icon: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const res = await createOrder({ shippingAddress: address, paymentMethod });
      navigate('/order/success', { state: { order: res.order } });
    } catch (err) {
      Swal.fire({ title: 'Checkout failed', icon: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Announcement />
      <AppNavBar />
      <Container className="py-5">
        <div className="text-center mb-4">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your order details below</p>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : (
          <div className="row g-4 justify-content-center">
            <div className="col-lg-7">
              <div className="admin-form-card">
                <h5 className="fw-semibold mb-3">Shipping Address</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      required
                      value={address.fullName}
                      onChange={(e) => handleField('fullName', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      required
                      value={address.addressLine1}
                      onChange={(e) => handleField('addressLine1', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address line 2 <span className="text-muted">(optional)</span></Form.Label>
                    <Form.Control
                      value={address.addressLine2}
                      onChange={(e) => handleField('addressLine2', e.target.value)}
                    />
                  </Form.Group>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-8">
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          required
                          value={address.city}
                          onChange={(e) => handleField('city', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-sm-4">
                      <Form.Group>
                        <Form.Label>Postal code</Form.Label>
                        <Form.Control
                          value={address.postalCode}
                          onChange={(e) => handleField('postalCode', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group className="mb-4">
                    <Form.Label>Payment method</Form.Label>
                    <Form.Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="gcash">GCash</option>
                      <option value="grabpay">GrabPay</option>
                    </Form.Select>
                    {paymentMethod === 'cod' ? (
                      <Form.Text className="text-muted">
                        Pay in cash when your order is delivered — no upfront payment needed.
                      </Form.Text>
                    ) : (
                      <Form.Text className="text-muted">
                        After placing your order, you&apos;ll get the {paymentMethod === 'gcash' ? 'GCash' : 'GrabPay'} account
                        details and a reference number to complete payment.
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                    {loading ? 'Processing...' : `Place Order — ₱${grandTotal.toFixed(2)}`}
                  </Button>
                </Form>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="cart-summary">
                <h5 className="fw-semibold mb-3">Order Summary</h5>
                {cartData?.cart?.products?.map((item) => (
                  <div key={item.productId._id} className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">
                      {item.productId.name} × {item.quantity}
                    </span>
                    <span>₱{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <hr />
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
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong className="text-accent">₱{grandTotal.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
}
