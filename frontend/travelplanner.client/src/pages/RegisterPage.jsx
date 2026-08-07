import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateFullName } from '../utils/validators';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (nameErr) e.fullName = nameErr;
    if (emailErr) e.email = emailErr;
    if (passErr) e.password = passErr;
    if (password !== confirmPassword) e.confirmPassword = 'Lozinke se ne poklapaju.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(fullName, email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registracija nije uspela. Pokušajte ponovo.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Registracija</h2>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <div className="form-group">
          <label htmlFor="fullName">Ime i prezime</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword">Potvrdi lozinku</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Registracija...' : 'Registruj se'}
        </button>

        <p className="auth-switch">
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </form>
    </div>
  );
}