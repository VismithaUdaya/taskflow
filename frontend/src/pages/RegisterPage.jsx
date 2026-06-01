import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import styles from './AuthPage.module.css';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill all fields');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>TF</div>
          <h1 className={styles.title}>TaskFlow</h1>
        </div>

        <h2 className={styles.heading}>Create account</h2>
        <p className={styles.sub}>Start organizing your work</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Smith"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </button>
        </form>

        <p className={styles.link}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
