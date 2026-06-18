import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- Modo offline: login simulado sin backend ---
    // Puedes quitar este bloque cuando conectes MySQL
    const offlineUsers = [
      { id: 1, nombre: 'Administrador', email: 'admin@gymx.com', rol: 'admin', password: 'admin123' },
      { id: 2, nombre: 'Recepcionista', email: 'recepcion@gymx.com', rol: 'recepcionista', password: 'recep123' },
      { id: 3, nombre: 'Coach Diego', email: 'coach@gymx.com', rol: 'entrenador', password: 'coach123' },
    ];

    const matchedUser = offlineUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      const { password: _, ...userData } = matchedUser;
      login(userData, 'offline_token_' + Date.now());
      setLoading(false);
      navigate('/');
      return;
    }

    // --- Modo online: login contra la API real ---
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      // Si el backend no responde, mostrar error claro
      setError('Credenciales incorrectas. Prueba con las cuentas demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="login-container animate-slide-up">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Dumbbell size={32} />
          </div>
          <h1>GYM<span>X</span></h1>
          <p>Sistema de Gestión</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">Ingresa tus credenciales para acceder al panel.</p>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="login-field">
            <label>Email</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                type="email"
                placeholder="correo@gymx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner"></span>
            ) : (
              <>
                <LogIn size={18} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="login-demo">
          <span className="demo-title">Cuentas demo</span>
          <div className="demo-accounts">
            <button
              type="button"
              className="demo-account"
              onClick={() => { setEmail('admin@gymx.com'); setPassword('admin123'); }}
            >
              <span className="demo-role">👑 Admin</span>
              <span className="demo-email">admin@gymx.com</span>
            </button>
            <button
              type="button"
              className="demo-account"
              onClick={() => { setEmail('recepcion@gymx.com'); setPassword('recep123'); }}
            >
              <span className="demo-role">🧑‍💼 Recepción</span>
              <span className="demo-email">recepcion@gymx.com</span>
            </button>
            <button
              type="button"
              className="demo-account"
              onClick={() => { setEmail('coach@gymx.com'); setPassword('coach123'); }}
            >
              <span className="demo-role">🏋️ Entrenador</span>
              <span className="demo-email">coach@gymx.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
