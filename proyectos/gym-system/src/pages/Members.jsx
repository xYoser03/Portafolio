import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, UserPlus, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { membersAPI, tryAPI } from '../services/api';
import mockMembers from '../data/mockMembers';
import './Members.css';

const STATUS_COLORS = {
  Activo: 'status-active',
  'Por vencer': 'status-warning',
  Vencido: 'status-expired',
};

const PLAN_COLORS = {
  Mensual: 'plan-monthly',
  Trimestral: 'plan-quarterly',
  VIP: 'plan-vip',
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    nombre: '',
    email: '',
    telefono: '',
    plan: 'Mensual',
    edad: '',
    genero: 'M',
  });

  // Cargar miembros desde API o mock
  useEffect(() => {
    const loadMembers = async () => {
      const data = await tryAPI(() => membersAPI.getAll(), mockMembers);
      // Normalizar datos de la API al formato esperado
      const normalized = data.map(m => ({
        id: m.id,
        nombre: m.nombre,
        email: m.email,
        telefono: m.telefono,
        plan: m.plan_nombre || m.plan || 'Mensual',
        fechaInicio: m.fecha_inicio || m.fechaInicio,
        fechaFin: m.fecha_fin || m.fechaFin,
        estado: m.estado_membresia || m.estado || 'Activo',
        edad: m.edad,
        genero: m.genero,
        asistencias: m.asistencias || 0,
      }));
      setMembers(normalized);
    };
    loadMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || m.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: members.length,
    activos: members.filter((m) => m.estado === 'Activo').length,
    porVencer: members.filter((m) => m.estado === 'Por vencer').length,
    vencidos: members.filter((m) => m.estado === 'Vencido').length,
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const today = new Date();
    const endDate = new Date(today);

    if (newMember.plan === 'Mensual') endDate.setMonth(endDate.getMonth() + 1);
    else if (newMember.plan === 'Trimestral') endDate.setMonth(endDate.getMonth() + 3);
    else endDate.setMonth(endDate.getMonth() + 6);

    // Intentar crear en la API
    const planMap = { Mensual: 1, Trimestral: 2, VIP: 3 };
    try {
      await membersAPI.create({
        nombre: newMember.nombre,
        email: newMember.email,
        telefono: newMember.telefono,
        edad: parseInt(newMember.edad),
        genero: newMember.genero,
        plan_id: planMap[newMember.plan],
      });
    } catch {
      // Fallback: agregar localmente
    }

    const member = {
      id: members.length + 1,
      ...newMember,
      edad: parseInt(newMember.edad),
      fechaInicio: today.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0],
      estado: 'Activo',
      asistencias: 0,
    };

    setMembers([member, ...members]);
    setShowModal(false);
    setNewMember({ nombre: '', email: '', telefono: '', plan: 'Mensual', edad: '', genero: 'M' });
  };

  return (
    <div className="members-page">
      {/* Header */}
      <div className="members-header animate-slide-up">
        <div>
          <h1 className="page-title">Miembros</h1>
          <p className="page-subtitle">Gestiona todos los socios de tu gimnasio.</p>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          Nuevo Miembro
        </button>
      </div>

      {/* Quick Stats */}
      <div className="members-stats animate-slide-up delay-100">
        <div className="mini-stat">
          <span className="mini-stat-value">{stats.total}</span>
          <span className="mini-stat-label">Total</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value stat-green">{stats.activos}</span>
          <span className="mini-stat-label">Activos</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value stat-yellow">{stats.porVencer}</span>
          <span className="mini-stat-label">Por vencer</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value stat-red">{stats.vencidos}</span>
          <span className="mini-stat-label">Vencidos</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="members-toolbar glass-panel animate-slide-up delay-200">
        <div className="toolbar-search">
          <Search size={18} className="toolbar-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="toolbar-input"
          />
        </div>
        <div className="toolbar-filters">
          {['Todos', 'Activo', 'Por vencer', 'Vencido'].map((status) => (
            <button
              key={status}
              className={`filter-chip ${filterStatus === status ? 'filter-active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="members-table-container glass-panel animate-slide-up delay-300">
        <table className="members-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Vencimiento</th>
              <th>Asistencias</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="member-cell">
                    <div className="member-avatar">
                      {member.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.nombre}</span>
                      <span className="member-email">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`plan-badge ${PLAN_COLORS[member.plan]}`}>{member.plan}</span>
                </td>
                <td>
                  <span className={`status-badge ${STATUS_COLORS[member.estado]}`}>
                    <span className="status-dot"></span>
                    {member.estado}
                  </span>
                </td>
                <td className="date-cell">{member.fechaFin}</td>
                <td className="attendance-cell">{member.asistencias} visitas</td>
                <td>
                  <button className="icon-button">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  No se encontraron miembros con esos criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span className="table-count">
            Mostrando {filteredMembers.length} de {members.length} miembros
          </span>
          <div className="table-pagination">
            <button className="icon-button" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="pagination-page active">1</span>
            <button className="icon-button" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Nuevo Miembro</h2>
            <p className="modal-subtitle">Ingresa los datos del nuevo socio del gimnasio.</p>

            <form className="member-form" onSubmit={handleAddMember}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    required
                    value={newMember.nombre}
                    onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      required
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      type="tel"
                      placeholder="55-1234-5678"
                      required
                      value={newMember.telefono}
                      onChange={(e) => setNewMember({ ...newMember, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input
                    type="number"
                    placeholder="25"
                    min="12"
                    max="100"
                    required
                    value={newMember.edad}
                    onChange={(e) => setNewMember({ ...newMember, edad: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Plan</label>
                  <select
                    value={newMember.plan}
                    onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
                  >
                    <option value="Mensual">Mensual - $500</option>
                    <option value="Trimestral">Trimestral - $1,200</option>
                    <option value="VIP">VIP - $2,000</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Género</label>
                  <select
                    value={newMember.genero}
                    onChange={(e) => setNewMember({ ...newMember, genero: e.target.value })}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={18} />
                  Registrar Miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
