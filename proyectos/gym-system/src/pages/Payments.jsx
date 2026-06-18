import { useState, useEffect } from 'react';
import { DollarSign, Search, CreditCard, Banknote, ArrowRightLeft, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { paymentsAPI, tryAPI } from '../services/api';
import mockPayments from '../data/mockPayments';
import './Payments.css';

const METHOD_ICONS = {
  Efectivo: Banknote,
  Tarjeta: CreditCard,
  Transferencia: ArrowRightLeft,
};

const STATUS_MAP = {
  Pagado: { cls: 'pay-status-paid', icon: CheckCircle },
  'Por vencer': { cls: 'pay-status-warning', icon: Clock },
  Vencido: { cls: 'pay-status-expired', icon: AlertTriangle },
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  useEffect(() => {
    const loadPayments = async () => {
      const data = await tryAPI(() => paymentsAPI.getAll(), mockPayments);
      const normalized = data.map(p => ({
        id: p.id,
        miembro: p.miembro || p.miembro_nombre || '',
        plan: p.plan_nombre || p.plan || '',
        monto: p.monto_pagado || p.monto || 0,
        metodo: p.metodo_pago || p.metodo || 'Efectivo',
        fecha: (p.fecha_inicio || p.fecha || '').split('T')[0],
        fechaVencimiento: (p.fecha_fin || p.fechaVencimiento || '').split('T')[0],
        estado: p.estado || 'Pagado',
      }));
      setPayments(normalized);
    };
    loadPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const matchSearch = p.miembro.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || p.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalIngresos = payments.filter(p => p.estado === 'Pagado').reduce((s, p) => s + p.monto, 0);
  const totalAdeudos = payments.filter(p => p.estado === 'Vencido').reduce((s, p) => s + p.monto, 0);
  const porVencer = payments.filter(p => p.estado === 'Por vencer').length;

  return (
    <div className="payments-page">
      <div className="payments-header animate-slide-up">
        <div>
          <h1 className="page-title">Cobros y Suscripciones</h1>
          <p className="page-subtitle">Control financiero de membresías del gimnasio.</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="pay-summary animate-slide-up delay-100">
        <div className="pay-summary-card summary-income">
          <DollarSign size={22} />
          <div>
            <span className="summary-label">Ingresos cobrados</span>
            <span className="summary-value">${totalIngresos.toLocaleString()}</span>
          </div>
        </div>
        <div className="pay-summary-card summary-debt">
          <AlertTriangle size={22} />
          <div>
            <span className="summary-label">Adeudos vencidos</span>
            <span className="summary-value">${totalAdeudos.toLocaleString()}</span>
          </div>
        </div>
        <div className="pay-summary-card summary-warning">
          <Clock size={22} />
          <div>
            <span className="summary-label">Por vencer</span>
            <span className="summary-value">{porVencer} membresías</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="pay-toolbar glass-panel animate-slide-up delay-200">
        <div className="toolbar-search">
          <Search size={18} className="toolbar-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre del miembro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="toolbar-input"
          />
        </div>
        <div className="toolbar-filters">
          {['Todos', 'Pagado', 'Por vencer', 'Vencido'].map((s) => (
            <button
              key={s}
              className={`filter-chip ${filterStatus === s ? 'filter-active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="pay-table-container glass-panel animate-slide-up delay-300">
        <table className="pay-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Plan</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Fecha de Pago</th>
              <th>Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const MethodIcon = METHOD_ICONS[p.metodo];
              const statusInfo = STATUS_MAP[p.estado];
              const StatusIcon = statusInfo.icon;
              return (
                <tr key={p.id}>
                  <td className="pay-member-name">{p.miembro}</td>
                  <td>
                    <span className={`plan-badge plan-${p.plan.toLowerCase()}`}>{p.plan}</span>
                  </td>
                  <td className="pay-amount">${p.monto.toLocaleString()}</td>
                  <td>
                    <span className="pay-method">
                      <MethodIcon size={14} />
                      {p.metodo}
                    </span>
                  </td>
                  <td className="pay-date">{p.fecha}</td>
                  <td className="pay-date">{p.fechaVencimiento}</td>
                  <td>
                    <span className={`pay-status ${statusInfo.cls}`}>
                      <StatusIcon size={14} />
                      {p.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-state">No se encontraron registros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
