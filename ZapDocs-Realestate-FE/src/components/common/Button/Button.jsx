import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'icon'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`zd-btn zd-btn--${variant} zd-btn--${size} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
