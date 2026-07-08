import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrello } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--brand">
        <div className="auth-panel__content">
          <FiTrello size={32} style={{ marginBottom: 'var(--space-4)' }} />
          <h2>Pick up right where your team left off.</h2>
          <p>Your teams, projects, and task boards are exactly where you left them.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <Link to="/" className="auth-card__brand">
            <span className="auth-card__brand-mark" />
            SyncSpace
          </Link>
          <h1>Welcome back</h1>
          <p>Log in to continue to your workspace.</p>

          <form onSubmit={handleSubmit}>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
            />
            <Button type="submit" variant="primary" block loading={submitting} style={{ marginTop: 'var(--space-3)' }}>
              Log in
            </Button>
          </form>

          <p className="auth-card__footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
