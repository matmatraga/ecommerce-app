const VARIANTS = ['card', 'detail', 'hero', 'thumb'];

export default function ProductImage({ src, alt, variant = 'card', className = '', knockout = true }) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'card';

  return (
    <div className={`product-image-frame product-image-frame--${safeVariant} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        className={`product-image${knockout ? ' product-image--knockout' : ''}`}
        loading="lazy"
      />
    </div>
  );
}
