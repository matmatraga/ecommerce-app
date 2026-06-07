import { useState, useEffect, useContext } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AppNavBar from '../components/AppNavBar';
import UserContext from '../context/UserContext';
import { login, getUserDetails } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const { user, setUser, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDisabled(!(email && password));
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      const profile = await getUserDetails();
      setUser({ id: profile._id, isAdmin: profile.isAdmin });
      refreshUser?.();
      Swal.fire({ title: 'Welcome back!', icon: 'success', text: 'Glad to see you at ASTER.' });
      navigate('/');
    } catch (err) {
      Swal.fire({ title: 'Authentication failed', icon: 'error', text: err.message });
    }
  };

  if (user.id) return <Navigate to="/" />;

  return (
    <div className="auth-page">
      <AppNavBar />
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="text-muted mb-4">Sign in to your ASTER account</p>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100 mb-3" disabled={isDisabled}>
            Sign In
          </Button>
          <p className="text-center text-muted mb-0">
            No account? <Link to="/register">Create one</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
