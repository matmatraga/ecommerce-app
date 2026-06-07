import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Container, Row, Col, Button, Form, Spinner, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import Announcement from '../components/Announcement';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import { getProduct, addReview } from '../api/products';
import { addToCart } from '../api/cart';

function stockClass(stock) {
  if (!stock) return 'stock-badge--out';
  if (stock <= 5) return 'stock-badge--low';
  return 'stock-badge--in';
}

function stockLabel(stock) {
  if (!stock) return 'Out of stock';
  if (stock <= 5) return `Only ${stock} left`;
  return `${stock} in stock`;
}

function renderStars(rating) {
  const full = Math.round(rating || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export default function ProductView() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });

  const product = data?.product;

  const cartMutation = useMutation({
    mutationFn: () => addToCart({ productId, quantity }),
    onSuccess: () => {
      Swal.fire({ title: 'Added to cart', icon: 'success' });
    },
    onError: (err) => Swal.fire({ title: 'Error', icon: 'error', text: err.message }),
  });

  const reviewMutation = useMutation({
    mutationFn: () => addReview(productId, { rating: Number(rating), comment }),
    onSuccess: () => {
      setComment('');
      refetch();
      Swal.fire({ title: 'Review submitted', icon: 'success' });
    },
    onError: (err) => Swal.fire({ title: 'Error', icon: 'error', text: err.message }),
  });

  if (isLoading) {
    return <div className="page-loading"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <Announcement />
      <AppNavBar />
      <Container className="py-5">
        <Row className="g-4 align-items-start">
          <Col lg={6}>
            <div className="product-detail-image-sticky">
              <div className="product-detail-card">
                <ProductImage src={product?.img} alt={product?.name} variant="detail" />
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <p className="text-muted text-uppercase small fw-semibold mb-1">
              {product?.category || 'peripheral'}
            </p>
            <h1 className="page-title mb-2">{product?.name}</h1>
            <p className="product-detail-price mb-3">₱{Number(product?.price).toFixed(2)}</p>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="rating-stars">{renderStars(product?.ratings)}</span>
              <span className="text-muted small">
                {product?.ratings?.toFixed(1)} ({product?.numReviews} reviews)
              </span>
            </div>

            <span className={`stock-badge ${stockClass(product?.stock)} mb-3`}>
              {stockLabel(product?.stock)}
            </span>

            <p className="text-muted my-3 product-detail-description">{product?.description}</p>

            {!user.isAdmin && (
              <div className="product-buy-box">
                {user.id && product?.stock > 0 && (
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="fw-semibold small">Qty:</span>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </Button>
                    <span className="px-2 fw-semibold">{quantity}</span>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product?.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                )}

                {user.id ? (
                  <Button
                    variant="dark"
                    size="lg"
                    className="w-100"
                    disabled={!product?.stock || cartMutation.isPending}
                    onClick={() => cartMutation.mutate()}
                  >
                    {product?.stock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                ) : (
                  <Button as={Link} to="/login" variant="dark" size="lg" className="w-100">
                    Login to add to cart
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>

        <section className="product-reviews-section mt-5 pt-4">
          <h5 className="fw-semibold mb-3">Customer Reviews</h5>
          {user.id && !user.isAdmin && (
            <Form
              className="mb-4 review-form-panel"
              onSubmit={(e) => {
                e.preventDefault();
                reviewMutation.mutate();
              }}
            >
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold">Your rating</Form.Label>
                <Form.Select value={rating} onChange={(e) => setRating(e.target.value)}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} stars</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" size="sm" variant="dark" disabled={reviewMutation.isPending}>
                Submit Review
              </Button>
            </Form>
          )}
          <ListGroup variant="flush" className="product-reviews-list">
            {product?.reviews?.length ? (
              product.reviews.map((r, i) => (
                <ListGroup.Item key={i} className="px-0 border-bottom">
                  <div className="d-flex justify-content-between">
                    <strong>{r.name}</strong>
                    <span className="rating-stars small">{renderStars(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-muted small mb-0 mt-1">{r.comment}</p>}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="px-0 text-muted">No reviews yet. Be the first!</ListGroup.Item>
            )}
          </ListGroup>
        </section>
      </Container>
      <Footer />
    </>
  );
}
