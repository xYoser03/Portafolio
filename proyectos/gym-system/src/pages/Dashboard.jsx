import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, tryAPI } from '../services/api';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="stat-card glass-panel animate-slide-up">
    <div className="stat-header">
      <div className="stat-info">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
      <div className="stat-icon-wrapper">
        <Icon size={24} className="stat-icon" />
      </div>
    </div>
    <div className={`stat-trend ${trendUp ? 'positive' : 'negative'}`}>
      <span>{trend}</span>
      <span className="trend-text">vs. mes pasado</span>
    </div>
  </div>
);

// Valores por defecto cuando no hay backend
const defaultStats = {
  totalMiembros: 1248,
  activos: 1102,
  ingresosMes: 24500,
  checkinHoy: 450,
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const loadStats = async () => {
      const data = await tryAPI(() => dashboardAPI.getStats(), defaultStats);
      setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header animate-slide-up delay-100">
        <div>
          <h1 className="page-title">Bienvenido, {user?.nombre || 'Admin'}</h1>
          <p className="page-subtitle">Aquí está el resumen de tu gimnasio hoy.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/miembros')}>
          + Nuevo Miembro
        </button>
      </div>

      <div className="grid-cards stats-grid">
        <StatCard 
          title="Miembros Activos" 
          value={stats.activos?.toLocaleString()} 
          icon={Users} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          title="Ingresos del Mes" 
          value={`$${Number(stats.ingresosMes)?.toLocaleString()}`}
          icon={DollarSign} 
          trend="+8%" 
          trendUp={true} 
        />
        <StatCard 
          title="Total Miembros" 
          value={stats.totalMiembros?.toLocaleString()} 
          icon={TrendingUp} 
          trend="+5%" 
          trendUp={true} 
        />
        <StatCard 
          title="Check-ins Hoy" 
          value={stats.checkinHoy?.toLocaleString()}
          icon={Activity} 
          trend="+3%" 
          trendUp={true} 
        />
      </div>

      <div className="dashboard-content grid-cards">
        <div className="glass-panel main-chart animate-slide-up delay-200">
          <h3>Asistencia por Hora</h3>
          <div className="chart-placeholder">
            <div className="bar-container">
              {[40, 60, 20, 30, 80, 100, 90, 50, 40, 70, 85].map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass-panel recent-activity animate-slide-up delay-300">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {[
              { time: 'Hace 5 min', text: 'Carlos M. renovó suscripción VIP', color: 'var(--accent-primary)' },
              { time: 'Hace 12 min', text: 'Ana Gómez hizo check-in', color: 'var(--text-secondary)' },
              { time: 'Hace 1 hora', text: 'Nueva inscripción: Roberto D.', color: '#00f2fe' },
              { time: 'Hace 2 horas', text: 'Clase de Yoga llena (20/20)', color: 'var(--accent-secondary)' },
            ].map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: act.color }}></div>
                <div className="activity-content">
                  <p>{act.text}</p>
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
