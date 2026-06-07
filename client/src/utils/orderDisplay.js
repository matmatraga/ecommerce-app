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
  qrph: 'QRPh',
};

// Methods that are settled online through PayMongo hosted checkout.
export const ONLINE_PAYMENT_METHODS = ['gcash', 'grabpay', 'qrph'];

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

// Returns payment guidance tailored to the method and whether the order is
// still awaiting payment. For online (PayMongo) methods, `canResume` signals
// that the shopper can be sent to the hosted checkout to complete payment.
// Returns null when there is nothing actionable to show.
export function getPaymentInstructions(order) {
  if (!order) return null;
  const { paymentMethod, status } = order;
  const awaitingPayment = status === 'pending';
  const label = PAYMENT_METHOD_LABEL[paymentMethod] || paymentMethod;

  if (paymentMethod === 'cod') {
    return {
      tone: 'info',
      heading: 'Cash on Delivery',
      intro: awaitingPayment
        ? 'No upfront payment needed — pay in cash when your order arrives.'
        : 'This order was placed with Cash on Delivery.',
      canResume: false,
      steps: awaitingPayment
        ? [
            'Prepare the exact total amount for a smooth handoff.',
            'Hand your payment to the courier upon delivery.',
          ]
        : [],
    };
  }

  if (ONLINE_PAYMENT_METHODS.includes(paymentMethod)) {
    return {
      tone: awaitingPayment ? 'warning' : 'success',
      heading: awaitingPayment ? 'Complete your payment' : 'Payment confirmed',
      intro: awaitingPayment
        ? `This order is awaiting payment. Pay securely via ${label} through PayMongo to confirm it.`
        : `We received your ${label} payment. Thank you!`,
      canResume: awaitingPayment,
      steps: [],
    };
  }

  return null;
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
