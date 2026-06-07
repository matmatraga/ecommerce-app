import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useContext, useState } from 'react';
import { archiveProduct, unarchiveProduct, deleteProduct } from '../api/products';
import ProductImage from './ProductImage';

function stockBadgeVariant(stock) {
  if (stock === 0) return 'danger';
  if (stock <= 5) return 'warning';
  return 'success';
}

export default function ProductCard({ productProp, onUpdated }) {
  const { user } = useContext(UserContext);
  const { _id, name, img, isActive, stock, price } = productProp;
  const [active, setActive] = useState(isActive);

  const [deleting, setDeleting] = useState(false);

  const toggleArchive = async () => {
    try {
      const fn = active ? archiveProduct : unarchiveProduct;
      const data = await fn(_id);
      setActive(data.product.isActive);
      Swal.fire({
        title: 'Success',
        icon: 'success',
        text: data.product.isActive ? 'Product unarchived' : 'Product archived',
      });
      onUpdated?.();
    } catch (err) {
      Swal.fire({ title: 'Error', icon: 'error', text: err.message });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete this product?',
      html: `<strong>${name}</strong> will be permanently removed from the catalog. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      setDeleting(true);
      try {
        await deleteProduct(_id);
        Swal.fire({ title: 'Deleted', icon: 'success', text: 'Product removed from catalog.' });
        onUpdated?.();
      } catch (err) {
        Swal.fire({ title: 'Error', icon: 'error', text: err.message });
      } finally {
        setDeleting(false);
      }
    });
  };

  return (
    <article className="product-card">
      <div className="product-card__img-wrap">
        <ProductImage src={img} alt={name} variant="card" />
        {user?.isAdmin && stock !== undefined && (
          <div className="product-card__badges">
            <Badge bg={stockBadgeVariant(stock)}>Stock: {stock}</Badge>
            {!active && <Badge bg="secondary">Archived</Badge>}
          </div>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>
        {price !== undefined && (
          <p className="product-card__price">₱{Number(price).toFixed(2)}</p>
        )}
        <div className="product-card__actions">
          {user?.isAdmin ? (
            <>
              <Button variant="dark" size="sm" as={Link} to={`/products/${_id}/updateproduct`}>
                Edit
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={toggleArchive}>
                {active ? 'Archive' : 'Unarchive'}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </>
          ) : (
            <Button variant="dark" size="sm" className="w-100" as={Link} to={`/products/${_id}`}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
