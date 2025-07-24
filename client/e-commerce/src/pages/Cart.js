import UserContext from '../UserContext';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardGroup } from 'react-bootstrap';
import AppNavbar from '../components/AppNavBar.js';
import Announcement from '../components/Announcement.js';
import Newsletter from '../components/Newsletter.js';
import Footer from '../components/Footer.js';

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState();
  const [cartTotal, setCartTotal] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/carts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data) {
          setCart(data);
        } else {
          setCart();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${process.env.REACT_APP_API_URL}/carts/total`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data) {
          setCartTotal(data.totalPrice);
        } else {
          setCartTotal(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // const checkoutOrder = () => {
  //   fetch(`${process.env.REACT_APP_API_URL}/carts/removecart`, {
  //     method: 'DELETE',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(() => {
  //       navigate('/order')
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }

  return !user.isAdmin && user.id ? (
    <>
      <Announcement />
      <AppNavbar />
      <Container className="mb-4">
        <Row lg={2} md={6} xs={12} className="justify-content-center">
          <Col className="text-center mt-3">
            <h1>Cart</h1>
            <CardGroup className="d-flex flex-wrap justify-content-center">
              {cart?.products?.map((product) => (
                <Card bg="light" border="dark" key={product.productId?._id} className="mt-3">
                  <Card.Img variant="top" src={product.productId?.img} />
                  <Card.Body>
                    <Card.Title>{product.productId?.name}</Card.Title>
                    <Card.Text>{product.productId?.description}</Card.Text>
                    <Card.Text>Quantity: {product.quantity}</Card.Text>
                    <Card.Text>
                      Subtotal: {product.quantity * product.productId?.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </CardGroup>
            <h2 className="mt-3 text-center">Total Price: {cartTotal}</h2>
            <div className="text-center">
              <Button variant="dark" type="submit" onClick={() => navigate('/order')}>
                Checkout Order
              </Button>
            </div>
          </Col>
        </Row>
      </Container >
      <Newsletter />
      <Footer />
    </>
  ) : (
    <Navigate to="/notFound" />
  );
}
