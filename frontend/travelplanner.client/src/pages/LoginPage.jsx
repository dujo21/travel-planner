import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) e.email = emailErr;
    if (passErr) e.password = passErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Prijava nije uspela. Pokušajte ponovo.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Prijava</h2>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Lozinka</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>

        <p className="auth-switch">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </form>
    </div>
  );
}