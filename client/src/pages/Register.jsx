import { useState, useEffect, useContext } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AppNavBar from '../components/AppNavBar';
import UserContext from '../context/UserContext';
import { register } from '../api/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDisabled(
      !(email && password1 && password2 && password1 === password2 && password1.length >= 8)
    );
  }, [email, password1, password2]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password: password1 });
      Swal.fire({ title: 'Registration successful', icon: 'success' });
      navigate('/login');
    } catch (err) {
      Swal.fire({ title: 'Registration failed', icon: 'error', text: err.message });
    }
  };

  if (user.id) return <Navigate to="/" />;

  return (
    <div className="auth-page">
      <AppNavBar />
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="text-muted mb-4">Join ASTER and start shopping</p>
        <Form onSubmit={handleRegister}>
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
              placeholder="Min. 8 characters"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repeat password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100 mb-3" disabled={isDisabled}>
            Create Account
          </Button>
          <p className="text-center text-muted mb-0">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
