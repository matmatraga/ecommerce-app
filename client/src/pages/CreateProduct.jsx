import { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import { createProduct } from '../api/products';
import { CATEGORIES } from '../data';

export default function CreateProduct() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    img: '',
    stock: 10,
    category: 'keyboards',
  });

  if (!user.isAdmin) return <Navigate to="/" />;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      Swal.fire({ title: 'Product created', icon: 'success' });
      navigate('/admin');
    } catch (err) {
      Swal.fire({ title: 'Error', icon: 'error', text: err.message });
    }
  };

  return (
    <>
      <AppNavBar />
      <Container className="py-5" style={{ maxWidth: 560 }}>
        <div className="admin-form-card">
          <h1 className="page-title text-center mb-4">Create Product</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Form.Group>
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Price (₱)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                required
                value={form.img}
                onChange={(e) => handleChange('img', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="dark" className="flex-grow-1">
                Create Product
              </Button>
              <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}
