const Input = ({
  label,
  id,
  type = 'text',
  as = 'input',
  error,
  rows = 4,
  className = '',
  ...rest
}) => {
  const Field = as === 'textarea' ? 'textarea' : 'input';
  const fieldClass = as === 'textarea' ? 'form-textarea' : 'form-input';

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <Field
        id={id}
        type={as === 'textarea' ? undefined : type}
        rows={as === 'textarea' ? rows : undefined}
        className={`${fieldClass} ${error ? 'has-error' : ''} ${className}`.trim()}
        {...rest}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default Input;
