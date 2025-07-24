import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal2 from 'sweetalert2';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import UserContext from '../UserContext.js';
import Announcement from '../components/Announcement.js';
import AppNavBar from '../components/AppNavBar.js';
import Newsletter from '../components/Newsletter.js';
import Footer from '../components/Footer.js';


export default function ProductView() {
  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(UserContext);

  const { productId } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setImg(data.img);
        setPrice(data.price);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addToCart = (productId) => {
    fetch(`${process.env.REACT_APP_API_URL}/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { productId, quantity }
      ),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          Swal2.fire({
            title: 'Successfully added to cart',
            icon: 'success',
            text: 'You have successfully added the product to your cart!',
          });
        } else {
          Swal2.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Please try again.',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <Announcement />
      <AppNavBar />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={4} md={4} xs={12} className="text-center">
            <Card bg="light" border="dark">
              <Card.Img variant="top" src={img} />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>PhP {price}</Card.Text>
                <Card.Subtitle>Quantity:</Card.Subtitle>
                <div className="d-flex mb-2 mt-2 justify-content-center">
                  <Button variant="dark" onClick={handleDecreaseQuantity}>
                    -
                  </Button>
                  <span className="mx-2 mt-1">{quantity}</span>
                  <Button variant="dark" onClick={handleIncreaseQuantity}>
                    +
                  </Button>
                </div>
                {
                  user.id !== null
                    ?
                    <Button variant="dark" onClick={() => addToCart(productId)}>
                      Add to Cart
                    </Button>
                    :
                    <Button as={Link} to='/login'>Login to add to cart!</Button>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container >
      <Newsletter />
      <Footer />
    </>
  );
}

