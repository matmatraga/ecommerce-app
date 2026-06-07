import { Link } from 'react-router-dom';
import PaymentIcons from './PaymentIcons';

export default function Footer() {
  return (
    <footer className="aster-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <p className="brand-mark mb-2">ASTER.</p>
            <p>
              Premium gaming peripherals with fast shipping and gear you can trust in every match.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Shop</h5>
            <ul className="list-unstyled">
              <li className="mb-1"><Link to="/">Home</Link></li>
              <li className="mb-1"><Link to="/products">Products</Link></li>
              <li className="mb-1"><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Contact</h5>
            <p className="mb-1">Sta. Rosa, Laguna, Philippines</p>
            <p className="mb-3">contact@aster.dev</p>
            <h6 className="small text-uppercase opacity-75 mb-2">We accept</h6>
            <PaymentIcons />
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center mb-0 small opacity-75">
          © {new Date().getFullYear()} ASTER. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
