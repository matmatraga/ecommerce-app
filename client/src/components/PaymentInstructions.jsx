import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getPaymentInstructions } from '../utils/orderDisplay';
import { createCheckoutSession } from '../api/payments';

export default function PaymentInstructions({ order, className = '' }) {
  const [loading, setLoading] = useState(false);
  const info = getPaymentInstructions(order);
  if (!info) return null;

  const handleResume = async () => {
    setLoading(true);
    try {
      const { checkoutUrl } = await createCheckoutSession(order._id);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Could not start checkout.');
      }
    } catch (err) {
      Swal.fire({ title: 'Payment unavailable', icon: 'error', text: err.message });
      setLoading(false);
    }
  };

  return (
    <div className={`payment-instructions payment-instructions--${info.tone} ${className}`.trim()}>
      <h3 className="payment-instructions__heading">{info.heading}</h3>
      <p className="payment-instructions__intro">{info.intro}</p>

      {info.steps.length > 0 && (
        <ol className="payment-instructions__steps">
          {info.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}

      {info.canResume && (
        <Button variant="dark" size="sm" onClick={handleResume} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Redirecting…
            </>
          ) : (
            'Complete payment'
          )}
        </Button>
      )}
    </div>
  );
}
