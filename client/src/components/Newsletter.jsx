import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="newsletter-section">
      <h2 className="display-6 mb-2">Get launch updates</h2>
      <p className="mb-1 opacity-75">New drops, restocks, and exclusive deals on gaming gear.</p>
      <p className="newsletter-section__note mb-4">No spam — just the gear that matters.</p>

      {subscribed ? (
        <p className="newsletter-section__success mb-0" role="status">
          You&apos;re on the list, <strong>{email.trim()}</strong>! Watch your inbox for the first drop.
        </p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <div className="d-flex justify-content-center px-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              aria-label="Email address"
              aria-invalid={Boolean(error)}
            />
            <button type="submit" className="btn btn-subscribe">
              Notify me
            </button>
          </div>
          {error && (
            <p className="newsletter-section__error mb-0 mt-2" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
