import { useRef, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { uploadProductImage } from '../api/upload';

export default function ImageUploadField({ value, onChange, required }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      onChange(res.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-field">
      <Form.Label>Product image</Form.Label>

      {value && (
        <div className="image-upload-field__preview">
          <img src={value} alt="Product preview" />
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
        <Button
          type="button"
          variant="outline-dark"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Uploading…
            </>
          ) : value ? (
            'Replace image'
          ) : (
            'Upload image'
          )}
        </Button>
        {value && <span className="text-muted small">Image set</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="d-none"
        onChange={handleFile}
      />

      <Form.Control
        type="url"
        placeholder="…or paste an image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      <Form.Text className="text-muted">
        Upload a file (max 5&nbsp;MB) or paste a direct image URL.
      </Form.Text>
      {error && <p className="text-danger small mb-0 mt-1">{error}</p>}
    </div>
  );
}
