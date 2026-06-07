import { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Spinner, Badge, Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import { getMyOrders, cancelOrder } from '../api/orders';
import {
  ORDER_STATUS_VARIANT,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  ORDER_PROGRESS_STEPS,
  formatOrderId,
  getOrderBreakdown,
  formatAddress,
} from '../utils/orderDisplay';

function OrderProgress({ status }) {
  if (status === 'cancelled' || status === 'refunded') return null;

  const currentIndex = ORDER_PROGRESS_STEPS.indexOf(status);

  return (
    <div className="order-progress" aria-label="Order progress">
      {ORDER_PROGRESS_STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <div
            key={step}
            className={`order-progress__step${done ? ' order-progress__step--done' : ''}${active ? ' order-progress__step--active' : ''}`}
          >
            <span className="order-progress__dot" />
            <span className="order-progress__label">{ORDER_STATUS_LABEL[step]}</span>
          </div>
        );
      })}
    </div>
  );
}

function OrderPreview({ products }) {
  if (!products?.length) return null;

  const preview = products.slice(0, 3);
  const remaining = products.length - preview.length;
  const names = preview
    .map((item) => item.productId?.name || 'Product')
    .join(' · ');

  return (
    <p className="order-history-card__preview text-muted small mb-0">
      {names}
      {remaining > 0 && ` · +${remaining} more`}
    </p>
  );
}

function OrderCard({ order, expanded, onToggle, onCancel, isCancelling }) {
  const breakdown = getOrderBreakdown(order);
  const addressLines = formatAddress(order.shippingAddress);
  const itemCount = order.products?.reduce((n, p) => n + p.quantity, 0) ?? 0;
  const detailsId = `order-details-${order._id}`;

  const handleCancel = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Cancel this order?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel order',
      cancelButtonText: 'Keep order',
    }).then((result) => {
      if (result.isConfirmed) onCancel(order._id);
    });
  };

  return (
    <article className={`order-history-card${expanded ? ' order-history-card--expanded' : ''}`}>
      <button
        type="button"
        className="order-history-card__header"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
      >
        <div className="order-history-card__summary">
          <div className="order-history-card__summary-left">
            <p className="order-history-card__id mb-1">{formatOrderId(order._id)}</p>
            <p className="text-muted small mb-1">
              {new Date(order.purchasedOn).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
              {' · '}
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
            {!expanded && <OrderPreview products={order.products} />}
          </div>
          <div className="order-history-card__summary-right">
            <Badge
              bg={ORDER_STATUS_VARIANT[order.status] || 'secondary'}
              className="text-capitalize mb-2"
            >
              {ORDER_STATUS_LABEL[order.status] || order.status}
            </Badge>
            <p className="order-history-card__total mb-0">
              ₱{Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>
        <span className="order-history-card__chevron" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
        <span className="visually-hidden">
          {expanded ? 'Collapse order details' : 'Expand order details'}
        </span>
      </button>

      <Collapse in={expanded}>
        <div id={detailsId}>
          <div className="order-history-card__body">
            <OrderProgress status={order.status} />

            <section className="order-history-section">
              <h3 className="order-history-section__title">Items</h3>
              <ul className="order-line-items list-unstyled mb-0">
                {order.products?.map((item) => {
                  const product = item.productId;
                  const name = product?.name || 'Product';
                  const img = product?.img;
                  return (
                    <li key={`${order._id}-${product?._id || item.productId}`} className="order-line-item">
                      {img ? (
                        <ProductImage src={img} alt={name} variant="thumb" knockout={false} />
                      ) : (
                        <div className="order-line-item__placeholder" aria-hidden="true" />
                      )}
                      <div className="order-line-item__info flex-grow-1">
                        <p className="order-line-item__name mb-1">{name}</p>
                        <p className="text-muted small mb-0">
                          Qty {item.quantity} · ₱{Number(item.priceAtPurchase).toFixed(2)} each
                        </p>
                      </div>
                      <strong className="order-line-item__price">
                        ₱{Number(item.subtotal).toFixed(2)}
                      </strong>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="row g-4 mt-1">
              <div className="col-md-6">
                <section className="order-history-section">
                  <h3 className="order-history-section__title">Shipping address</h3>
                  {addressLines ? (
                    <address className="order-history-address mb-0">
                      {addressLines.map((line) => (
                        <span key={line}>{line}<br /></span>
                      ))}
                    </address>
                  ) : (
                    <p className="text-muted mb-0">No shipping address on file.</p>
                  )}
                </section>
              </div>
              <div className="col-md-6">
                <section className="order-history-section">
                  <h3 className="order-history-section__title">Payment</h3>
                  <p className="mb-0">
                    {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod || '—'}
                  </p>
                </section>

                <section className="order-history-section mt-4">
                  <h3 className="order-history-section__title">Order summary</h3>
                  <div className="order-summary-rows">
                    <div className="order-summary-row">
                      <span className="text-muted">Subtotal</span>
                      <span>₱{breakdown.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="order-summary-row">
                      <span className="text-muted">Tax (12%)</span>
                      <span>₱{breakdown.tax.toFixed(2)}</span>
                    </div>
                    <div className="order-summary-row">
                      <span className="text-muted">Shipping</span>
                      <span>₱{breakdown.shipping.toFixed(2)}</span>
                    </div>
                    <div className="order-summary-row order-summary-row--total">
                      <strong>Total</strong>
                      <strong>₱{breakdown.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="order-history-card__actions">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  Cancel order
                </Button>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </article>
  );
}

export default function AccountOrders() {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    enabled: !!user.id && !user.isAdmin,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      Swal.fire({ title: 'Order cancelled', icon: 'success' });
    },
    onError: (err) => {
      Swal.fire({ title: 'Could not cancel', icon: 'error', text: err.message });
    },
  });

  if (!user.id || user.isAdmin) return <Navigate to="/login" />;

  const orders = data?.orders ?? [];

  const toggleOrder = (orderId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(orders.map((o) => o._id)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <>
      <AppNavBar />
      <div className="container py-5">
        <div className="text-center mb-4 mb-md-5">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Tap an order to expand details — keep your list compact
          </p>
        </div>

        {isLoading ? (
          <div className="page-loading"><Spinner animation="border" /></div>
        ) : isError ? (
          <div className="empty-state">
            <p className="text-danger mb-0">{error?.message || 'Failed to load orders.'}</p>
          </div>
        ) : orders.length ? (
          <>
            {orders.length > 1 && (
              <div className="order-history-toolbar">
                <span className="text-muted small">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
                <div className="d-flex gap-2">
                  <Button variant="outline-dark" size="sm" onClick={expandAll}>
                    Expand all
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={collapseAll}>
                    Collapse all
                  </Button>
                </div>
              </div>
            )}
            <div className="order-history-list" aria-label="Your orders">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  expanded={expandedIds.has(order._id)}
                  onToggle={() => toggleOrder(order._id)}
                  onCancel={cancelMutation.mutate}
                  isCancelling={cancelMutation.isPending}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h4>No orders yet</h4>
            <p className="text-muted mb-3">When you place an order, it will show up here with full details.</p>
            <Button as={Link} to="/products" variant="dark">
              Start shopping
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
