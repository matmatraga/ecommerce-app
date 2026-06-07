import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1>404</h1>
      <p>Page not found.</p>
      <Button as={Link} to="/" variant="dark">Go Home</Button>
    </div>
  );
}
