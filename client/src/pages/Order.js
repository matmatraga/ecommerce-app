import UserContext from '../UserContext';
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Announcement from '../components/Announcement';
import AppNavBar from '../components/AppNavBar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

export default function Order() {
  const { user } = useContext(UserContext);
  const [order, setOrder] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setOrder(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return !user.isAdmin ? (
    <>
      <Announcement />
      <AppNavBar />
      <Container>
        <h1 className="text-center mt-3">Order</h1>
        <Card className="mb-5 mt-3 text-center">
          <Card.Body>
            <Card.Title>Name:</Card.Title>
            <Card.Text>{order?.products[0]?.productId?.name || ''}</Card.Text>
            <Card.Title>Items Purchased:</Card.Title>
            <Card.Text>{order?.products && order.products.length}</Card.Text>
            <Card.Title>Purchased On:</Card.Title>
            <Card.Text>{order?.purchasedOn}</Card.Text>
            <Card.Title>Status</Card.Title>
            <Card.Text>{order?.status}</Card.Text>
            <Card.Title>Total Amount:</Card.Title>
            <Card.Text>{order?.totalAmount || 0}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
      <Newsletter />
      <Footer />
    </>
  ) : (
    <Navigate to="/notFound" />
  )
}
