import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Dumbbell, ShoppingCart, Settings, Receipt, ScanLine } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Miembros', icon: Users, path: '/miembros' },
    { name: 'Cobros', icon: Receipt, path: '/cobros' },
    { name: 'Punto de Venta', icon: ShoppingCart, path: '/pos' },
    { name: 'Check-in', icon: ScanLine, path: '/checkin' },
    { name: 'Clases', icon: Calendar, path: '/clases' },
    { name: 'Rutinas', icon: Dumbbell, path: '/rutinas' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <Dumbbell className="logo-icon" size={28} />
          <h1 className="logo-text">GYM<span>X</span></h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              to={item.path} 
              key={item.name}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/ajustes" className={`nav-item ${location.pathname === '/ajustes' ? 'active' : ''}`}>
          <Settings size={20} className="nav-icon" />
          <span>Ajustes</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
