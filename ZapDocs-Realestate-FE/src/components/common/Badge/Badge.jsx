import './Badge.css';

export default function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
  size = 'md',        // 'sm' | 'md'
  className = '',
  ...props
}) {
  return (
    <span
      className={`zd-badge zd-badge--${variant} zd-badge--${size} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
