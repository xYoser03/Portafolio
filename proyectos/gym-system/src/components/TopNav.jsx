import { useNavigate } from 'react-router-dom';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TopNav.css';

const ROLE_LABELS = {
  admin: 'Administrador',
  recepcionista: 'Recepcionista',
  entrenador: 'Entrenador',
};

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-nav glass-panel">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Buscar miembros, facturas o clases..." 
          className="search-input"
        />
      </div>

      <div className="nav-actions">
        <button className="icon-button notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.nombre || 'Usuario'}</span>
            <span className="user-role">{ROLE_LABELS[user?.rol] || user?.rol}</span>
          </div>
          <UserCircle size={36} className="avatar-icon" />
        </div>

        <button className="icon-button logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;

