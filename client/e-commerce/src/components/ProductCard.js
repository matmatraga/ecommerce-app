import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import UserContext from '../UserContext.js';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal2 from 'sweetalert2';

export default function ProductCard(props) {
  const { user } = useContext(UserContext);
  const { _id, name, img, isActive } = props.productProp;
  const [isUnarchived, setIsUnarchived] = useState(isActive);

  const handleDisable = () => {
    archive(_id, !isUnarchived);
  };

  const archive = (productId, isActive) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archivedproduct`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ isActive: isActive }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUnarchived(data.isActive);
        if (data === false) {
          Swal2.fire({
            title: 'Sucessful',
            icon: 'success',
            text: 'Product Successfully archived'
          })
        } else {
          Swal2.fire({
            title: 'Sucessful',
            icon: 'success',
            text: 'Product Successfully unarchived'
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderActionButton = () => {
    if (user && user.isAdmin) {
      return (
        <>
          <Button variant="primary" className="me-2" as={Link} to={`/products/${_id}/updateproduct`}>
            Update
          </Button>
          <Button variant="danger" onClick={handleDisable}>
            {isUnarchived ? 'Archive' : 'Unarchive'}
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="dark" as={Link} to={`/products/${_id}`}>
          Details
        </Button>
      );
    }
  };

  return (
    <Container className="mb-4">
      <Row className="justify-content-center">
        <Col lg={4} md={6} xs={12} className="text-center">
          <Card border="dark">
            <Card.Img variant="top" src={img} />
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              {renderActionButton()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
