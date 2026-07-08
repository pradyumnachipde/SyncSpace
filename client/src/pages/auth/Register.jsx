import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrello } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--brand">
        <div className="auth-panel__content">
          <FiTrello size={32} style={{ marginBottom: 'var(--space-4)' }} />
          <h2>Set up your team's workspace in under a minute.</h2>
          <p>Create your account, then create or join a team to get started.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <Link to="/" className="auth-card__brand">
            <span className="auth-card__brand-mark" />
            SyncSpace
          </Link>
          <h1>Create your account</h1>
          <p>Start managing your team's work today.</p>

          <form onSubmit={handleSubmit}>
            <Input
              id="register-name"
              label="Full name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
            <Input
              id="register-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
            />
            <Button type="submit" variant="primary" block loading={submitting} style={{ marginTop: 'var(--space-3)' }}>
              Create account
            </Button>
          </form>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
