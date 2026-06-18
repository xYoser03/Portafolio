import { useState } from 'react';
import { ScanLine, ShieldCheck, ShieldAlert, RotateCcw, Clock } from 'lucide-react';
import { checkinAPI } from '../services/api';
import mockMembers from '../data/mockMembers';
import './CheckIn.css';

const CheckIn = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null); // null | { type: 'success' | 'denied', member }
  const [recentCheckins, setRecentCheckins] = useState([]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    const memberId = parseInt(code);

    // Intentar via API
    try {
      const data = await checkinAPI.register(memberId);
      setResult({ type: data.type, member: data.member });
      if (data.type === 'success') {
        setRecentCheckins(prev => [
          { member: data.member.nombre, plan: data.member.plan || 'N/A', time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) },
          ...prev.slice(0, 9),
        ]);
      }
      setCode('');
      return;
    } catch {
      // Fallback a datos mock
    }

    const member = mockMembers.find(m => m.id === memberId);

    if (!member) {
      setResult({ type: 'not-found' });
    } else if (member.estado === 'Vencido') {
      setResult({ type: 'denied', member });
    } else {
      setResult({ type: 'success', member });
      setRecentCheckins(prev => [
        { member: member.nombre, plan: member.plan, time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 9),
      ]);
    }
    setCode('');
  };

  const handleReset = () => {
    setResult(null);
    setCode('');
  };

  return (
    <div className="checkin-page">
      <div className="checkin-header animate-slide-up">
        <div>
          <h1 className="page-title">Control de Acceso</h1>
          <p className="page-subtitle">Registro rápido de asistencia. Ideal para recepción.</p>
        </div>
      </div>

      <div className="checkin-layout">
        {/* Main Panel */}
        <div className="checkin-main animate-slide-up delay-100">
          {/* Idle / Input State */}
          {result === null && (
            <div className="checkin-panel glass-panel checkin-idle">
              <ScanLine size={60} className="checkin-scan-icon" />
              <h2>Ingresa el código del miembro</h2>
              <p>Escribe el número de socio o escanea el código QR.</p>
              <form className="checkin-form" onSubmit={handleCheckIn}>
                <input
                  type="number"
                  placeholder="Ej: 1, 2, 3..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="checkin-input"
                  autoFocus
                  min="1"
                  required
                />
                <button type="submit" className="primary-button checkin-submit">
                  Verificar Acceso
                </button>
              </form>
              <span className="checkin-hint">Prueba con IDs del 1 al 10</span>
            </div>
          )}

          {/* SUCCESS State */}
          {result?.type === 'success' && (
            <div className="checkin-panel glass-panel checkin-success" onClick={handleReset}>
              <div className="checkin-result-icon success-glow">
                <ShieldCheck size={80} />
              </div>
              <h2>✅ Acceso Aprobado</h2>
              <p className="checkin-result-name">{result.member.nombre}</p>
              <span className="checkin-result-plan">Plan: {result.member.plan}</span>
              <span className="checkin-result-exp">Vence: {result.member.fechaFin}</span>
              <button className="secondary-button reset-btn" onClick={handleReset}>
                <RotateCcw size={16} /> Siguiente
              </button>
            </div>
          )}

          {/* DENIED State */}
          {result?.type === 'denied' && (
            <div className="checkin-panel glass-panel checkin-denied" onClick={handleReset}>
              <div className="checkin-result-icon denied-glow">
                <ShieldAlert size={80} />
              </div>
              <h2>🚫 Acceso Denegado</h2>
              <p className="checkin-result-name">{result.member.nombre}</p>
              <span className="checkin-result-reason">Membresía vencida desde {result.member.fechaFin}</span>
              <button className="secondary-button reset-btn" onClick={handleReset}>
                <RotateCcw size={16} /> Siguiente
              </button>
            </div>
          )}

          {/* NOT FOUND State */}
          {result?.type === 'not-found' && (
            <div className="checkin-panel glass-panel checkin-denied" onClick={handleReset}>
              <div className="checkin-result-icon denied-glow">
                <ShieldAlert size={80} />
              </div>
              <h2>❌ No encontrado</h2>
              <p className="checkin-result-name">Este código no corresponde a ningún miembro registrado.</p>
              <button className="secondary-button reset-btn" onClick={handleReset}>
                <RotateCcw size={16} /> Intentar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Recent Checkins */}
        <div className="checkin-recent glass-panel animate-slide-up delay-200">
          <h3>
            <Clock size={18} />
            Entradas recientes
          </h3>
          {recentCheckins.length === 0 ? (
            <p className="recent-empty">Aún no hay registros hoy.</p>
          ) : (
            <div className="recent-list">
              {recentCheckins.map((entry, i) => (
                <div key={i} className="recent-item">
                  <div className="recent-dot"></div>
                  <div className="recent-info">
                    <span className="recent-name">{entry.member}</span>
                    <span className="recent-plan">{entry.plan}</span>
                  </div>
                  <span className="recent-time">{entry.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
