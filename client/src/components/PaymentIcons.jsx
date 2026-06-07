const PAYMENT_ICONS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="#22C55E" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.5" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M6 9h.01M18 15h.01" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'gcash',
    label: 'GCash',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#007CFF" />
        <path
          fill="#fff"
          d="M12 7.5c-2.5 0-4.5 1.7-4.5 3.8 0 1.4.9 2.6 2.3 3.3l-.8 2.4 2.6-1.4c.5.1 1 .2 1.4.2 2.5 0 4.5-1.7 4.5-3.8S14.5 7.5 12 7.5z"
        />
      </svg>
    ),
  },
  {
    id: 'grabpay',
    label: 'GrabPay',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#00B14F" />
        <path
          fill="#fff"
          d="M8 16V8h2.2l2.1 4.5L14.4 8H16.5v8h-1.6v-4.8L12.2 16h-1.1l-2.7-4.8V16H8z"
        />
      </svg>
    ),
  },
];

export default function PaymentIcons() {
  return (
    <div className="payment-icons" role="list" aria-label="Accepted payment methods">
      {PAYMENT_ICONS.map(({ id, label, svg }) => (
        <div key={id} className="payment-icon" role="listitem" title={label} aria-label={label}>
          {svg}
        </div>
      ))}
    </div>
  );
}
