export const ORDER_STATUS_VARIANT = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'primary',
  cancelled: 'danger',
  refunded: 'secondary',
};

export const ORDER_STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const PAYMENT_METHOD_LABEL = {
  cod: 'Cash on Delivery',
  gcash: 'GCash',
  grabpay: 'GrabPay',
};

export const ORDER_PROGRESS_STEPS = ['pending', 'paid', 'shipped', 'delivered'];

export function formatOrderId(id) {
  return id ? `#${String(id).slice(-8).toUpperCase()}` : '';
}

export function getOrderBreakdown(order) {
  const subTotal = (order.products ?? []).reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
  const tax = subTotal * 0.12;
  const shipping = subTotal > 0 ? 40 : 0;
  return { subTotal, tax, shipping, total: order.totalAmount ?? subTotal + tax + shipping };
}

export function formatAddress(address) {
  if (!address) return null;
  const lines = [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.postalCode].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean);
  return lines.length ? lines : null;
}
