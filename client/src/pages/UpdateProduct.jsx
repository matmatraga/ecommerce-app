import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import AppNavBar from '../components/AppNavBar';
import { getProduct, updateProduct } from '../api/products';
import ImageUploadField from '../components/ImageUploadField';
import { CATEGORIES } from '../data';

export default function UpdateProduct() {
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    img: '',
    stock: '',
    category: 'keyboards',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: user.isAdmin,
  });

  useEffect(() => {
    if (data?.product) {
      const p = data.product;
      setForm({
        name: p.name,
        description: p.description,
        price: String(p.price),
        img: p.img || '',
        stock: String(p.stock ?? 0),
        category: p.category || 'keyboards',
      });
    }
  }, [data]);

  if (!user.isAdmin) return <Navigate to="/" />;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(productId, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        img: form.img,
        stock: Number(form.stock),
        category: form.category,
      });
      Swal.fire({ title: 'Updated', icon: 'success' });
      navigate('/admin');
    } catch (err) {
      Swal.fire({ title: 'Error', icon: 'error', text: err.message });
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <AppNavBar />
      <Container className="py-5" style={{ maxWidth: 560 }}>
        <div className="admin-form-card">
          <h1 className="page-title text-center mb-4">Update Product</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
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
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
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
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <ImageUploadField
                value={form.img}
                onChange={(url) => handleChange('img', url)}
                required
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
                Save Changes
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
