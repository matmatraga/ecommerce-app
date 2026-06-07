export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <h2 className="display-6 mb-2">Stay in the loop</h2>
      <p className="mb-4 opacity-75">New drops, restocks, and exclusive deals on gaming gear.</p>
      <div className="d-flex justify-content-center px-3">
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email address"
        />
        <button type="button" className="btn btn-subscribe">
          Subscribe
        </button>
      </div>
    </section>
  );
}
