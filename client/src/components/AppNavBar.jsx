import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import ThemeToggle from './ThemeToggle';

export default function AppNavBar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" variant="dark" className="aster-navbar sticky-top" aria-label="Main navigation">
      <Container>
        <Navbar.Brand as={Link} to="/">ASTER</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation menu" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            {!user.isAdmin && (
              <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
            )}
            {!user.isAdmin && user.id && (
              <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>
            )}
            {!user.isAdmin && user.id && (
              <Nav.Link as={NavLink} to="/account/orders">My Orders</Nav.Link>
            )}
            {user.isAdmin && (
              <Nav.Link as={NavLink} to="/admin">Admin Dashboard</Nav.Link>
            )}
            {!user.id ? (
              <>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
            )}
            <ThemeToggle />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
