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

// Shop-side e-wallet details, configurable via Vite env so the demo can ship
// with placeholders and a real deployment can point to an actual account.
export const SHOP_PAYMENT_DETAILS = {
  gcash: {
    label: 'GCash',
    accountName: import.meta.env.VITE_SHOP_GCASH_NAME || 'ASTER Gaming',
    number: import.meta.env.VITE_SHOP_GCASH_NUMBER || '0917 000 0000',
  },
  grabpay: {
    label: 'GrabPay',
    accountName: import.meta.env.VITE_SHOP_GRABPAY_NAME || 'ASTER Gaming',
    number: import.meta.env.VITE_SHOP_GRABPAY_NUMBER || '0917 000 0000',
  },
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

// Returns payment guidance tailored to the method and whether the order is
// still awaiting payment. Returns null when there is nothing actionable to show.
export function getPaymentInstructions(order) {
  if (!order) return null;
  const { paymentMethod, status } = order;
  const awaitingPayment = status === 'pending';

  if (paymentMethod === 'cod') {
    return {
      tone: 'info',
      heading: 'Cash on Delivery',
      intro: awaitingPayment
        ? 'No upfront payment needed — pay in cash when your order arrives.'
        : 'This order was placed with Cash on Delivery.',
      account: null,
      reference: null,
      steps: awaitingPayment
        ? [
            'Prepare the exact total amount for a smooth handoff.',
            'Hand your payment to the courier upon delivery.',
          ]
        : [],
    };
  }

  const details = SHOP_PAYMENT_DETAILS[paymentMethod];
  if (details) {
    return {
      tone: awaitingPayment ? 'warning' : 'success',
      heading: `Pay via ${details.label}`,
      intro: awaitingPayment
        ? `Send your payment to confirm this order — we'll update the status once received.`
        : `Payment received via ${details.label}. Thank you!`,
      account: awaitingPayment ? details : null,
      reference: awaitingPayment ? formatOrderId(order._id) : null,
      steps: awaitingPayment
        ? [
            `Open your ${details.label} app and send the total amount.`,
            `Send to ${details.accountName} (${details.number}).`,
            `Add your order number ${formatOrderId(order._id)} as the reference/note.`,
            'We verify payments manually and will mark your order as paid shortly.',
          ]
        : [],
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
