import { getPaymentInstructions } from '../utils/orderDisplay';

export default function PaymentInstructions({ order, className = '' }) {
  const info = getPaymentInstructions(order);
  if (!info) return null;

  return (
    <div className={`payment-instructions payment-instructions--${info.tone} ${className}`.trim()}>
      <h3 className="payment-instructions__heading">{info.heading}</h3>
      <p className="payment-instructions__intro">{info.intro}</p>

      {info.account && (
        <dl className="payment-instructions__account">
          <div className="payment-instructions__row">
            <dt>Send to</dt>
            <dd>{info.account.accountName}</dd>
          </div>
          <div className="payment-instructions__row">
            <dt>{info.account.label} number</dt>
            <dd>{info.account.number}</dd>
          </div>
          {info.reference && (
            <div className="payment-instructions__row">
              <dt>Reference</dt>
              <dd>{info.reference}</dd>
            </div>
          )}
        </dl>
      )}

      {info.steps.length > 0 && (
        <ol className="payment-instructions__steps">
          {info.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
