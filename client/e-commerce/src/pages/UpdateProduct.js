import {Container, Row, Col, Button, Form} from 'react-bootstrap';  
import {useState, useEffect, useContext} from 'react';

import UserContext from '../UserContext.js';

import {Link, useNavigate, Navigate, useParams} from 'react-router-dom';

import Swal2 from 'sweetalert2';

export default function UpdateProduct(){
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const {user, setUser} = useContext(UserContext);
  const {productId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          'Content-Type' : 'application/json'
        }
    })
      .then(result => result.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price)
      })
  }, [])

  function updateproduct(event){

    if(user.isAdmin){

      event.preventDefault();

      fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/updateproduct`, {
        method : 'PATCH',
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          'Content-Type' : 'application/json'

        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: price
            
        })
      })
      .then(result=> result.json())
      .then(data => {
        
        if(data){
          
      
          Swal2.fire({
            title: 'Sucessful',
            icon: 'success',
            text: 'Product Successfully updated'
          })

          navigate('/admin')
        }
        else{
          Swal2.fire({
            title: 'Error',
            icon: 'error',
            text: 'Please check details'
          })
        }     
      })  
    }
  }

  return(
    
    <Container className = 'mt-5'>
      <Row>
        <Col className = 'col-6 mx-auto'>
          <h1 className = 'text-center'>Update Product Information</h1>
          <Form onSubmit = {event => updateproduct(event)}> 

          
                <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value = {name}
                    onChange = {event => setName(event.target.value)}
                    placeholder="Enter Product Name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    type="text" 
                    value = {description}
                    onChange = {event => setDescription(event.target.value)}
                    placeholder="Description" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Price</Form.Label>
                  <Form.Control 
                    type="number" 
                    value = {price}
                    onChange = {event => setPrice(event.target.value)}
                    placeholder="Price" />
                </Form.Group>
              

                <Button 
                 variant="primary" 
                 type="submit"
                >
                  Submit
                </Button>
              </Form>

        </Col>
      </Row>
    </Container>
  )
}
