import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext.js';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavBar.js';
import Swal2 from 'sweetalert2';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (
      email !== '' &&
      password1 !== '' &&
      password2 !== '' &&
      password1 === password2 &&
      password1.length > 6
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email, password1, password2]);

  function register(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password1
      })
    })
      .then(result => result.json())
      .then(data => {

        if (data) {
          Swal2.fire({
            title: 'Registration successful',
            icon: 'success',
            text: 'Welcome to zuitt!'
          })
          navigate('/login')
        } else {
          Swal2.fire({
            title: 'Email has been taken',
            icon: 'error',
            text: 'Please use another email!'
          })
        }
      })
  }

  return user.id === null ? (
    <div style={{ backgroundColor: "black", minHeight: '100vh' }}>
      <AppNavbar />
      <Container>
        <Row>
          <Col className="col-6 mx-auto">
            <h1 className="text-center mt-5" style={{ color: "white" }}>Register</h1>
            <Form onSubmit={event => register(event)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={{ color: "white" }}>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword1">
                <Form.Label style={{ color: "white" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password1}
                  onChange={event => setPassword1(event.target.value)}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword2">
                <Form.Label style={{ color: "white" }}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password2}
                  onChange={event => setPassword2(event.target.value)}
                  placeholder="Retype your nominated password"
                />
              </Form.Group>

              <p style={{ color: "white" }}>
                Have an account already? <Link to="/login">Log in here.</Link>
              </p>

              <Button variant="light" type="submit" disabled={isDisabled}>
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Navigate to="/notFound" />
  );
}
