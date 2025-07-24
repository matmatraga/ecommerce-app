import ProductCard from '../components/ProductCard.js';
import UserContext from '../UserContext';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {Button, Card} from 'react-bootstrap';

export default function ListOrders() {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/orders/allorders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data) {
          // console.log(data)
          setOrders(data)
        } else {
          setOrders();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return user.isAdmin ? (
      <>
        <h1 className="text-center mt-3">List of Orders</h1>
        {orders?.map((order) => (
          <Card key={order._id} className="my-3">
            <Card.Body>
              <Card.Title>{order._id}</Card.Title>
              <Card.Text>Status: {order.status}</Card.Text>
              <Card.Text>Purchased On: {order.purchasedOn}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </>
    ) : (
      <Navigate to="/notFound" />
    );
  }