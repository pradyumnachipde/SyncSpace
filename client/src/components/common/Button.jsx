import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  block = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${block ? 'btn-block' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
};

export default Button;
