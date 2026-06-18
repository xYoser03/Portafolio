import { useState } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import mockClasses from '../data/mockClasses';
import './Classes.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Classes = () => {
  const [selectedDay, setSelectedDay] = useState(null); // null = ver todos
  const [selectedClass, setSelectedClass] = useState(null);

  const displayDays = selectedDay ? [selectedDay] : DAYS;

  const totalClases = mockClasses.length;
  const totalInscritos = mockClasses.reduce((s, c) => s + c.inscritos, 0);
  const clasesLlenas = mockClasses.filter(c => c.inscritos >= c.capacidad).length;

  return (
    <div className="classes-page">
      <div className="classes-header animate-slide-up">
        <div>
          <h1 className="page-title">Clases Grupales</h1>
          <p className="page-subtitle">Horario semanal de clases y reservas.</p>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="classes-stats animate-slide-up delay-100">
        <div className="cls-stat">
          <Calendar size={20} />
          <div>
            <span className="cls-stat-value">{totalClases}</span>
            <span className="cls-stat-label">Clases/semana</span>
          </div>
        </div>
        <div className="cls-stat">
          <Users size={20} />
          <div>
            <span className="cls-stat-value">{totalInscritos}</span>
            <span className="cls-stat-label">Inscritos totales</span>
          </div>
        </div>
        <div className="cls-stat cls-stat-full">
          <span className="cls-stat-value">{clasesLlenas}</span>
          <span className="cls-stat-label">Clases llenas</span>
        </div>
      </div>

      {/* Day Filter */}
      <div className="classes-day-filter animate-slide-up delay-200">
        <button
          className={`filter-chip ${selectedDay === null ? 'filter-active' : ''}`}
          onClick={() => setSelectedDay(null)}
        >
          Toda la semana
        </button>
        {DAYS.map(day => (
          <button
            key={day}
            className={`filter-chip ${selectedDay === day ? 'filter-active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="schedule-grid animate-slide-up delay-300">
        {displayDays.map(day => {
          const dayClasses = mockClasses.filter(c => c.dia === day);
          if (dayClasses.length === 0) return null;

          return (
            <div key={day} className="schedule-column">
              <div className="schedule-day-header">
                <h3>{day}</h3>
                <span className="day-count">{dayClasses.length} clases</span>
              </div>
              <div className="schedule-classes">
                {dayClasses.map(cls => {
                  const isFull = cls.inscritos >= cls.capacidad;
                  const occupancy = Math.round((cls.inscritos / cls.capacidad) * 100);

                  return (
                    <div
                      key={cls.id}
                      className={`class-card glass-panel ${isFull ? 'class-full' : ''}`}
                      style={{ borderLeftColor: cls.color }}
                      onClick={() => setSelectedClass(cls)}
                    >
                      <div className="class-card-top">
                        <span className="class-name" style={{ color: cls.color }}>{cls.nombre}</span>
                        <span className="class-time">
                          <Clock size={12} />
                          {cls.horaInicio} - {cls.horaFin}
                        </span>
                      </div>
                      <span className="class-instructor">{cls.instructor}</span>
                      <div className="class-card-bottom">
                        <div className="class-capacity">
                          <div className="capacity-bar-bg">
                            <div
                              className="capacity-bar-fill"
                              style={{
                                width: `${occupancy}%`,
                                background: isFull ? 'var(--accent-secondary)' : cls.color,
                              }}
                            ></div>
                          </div>
                          <span className="capacity-text">
                            {cls.inscritos}/{cls.capacidad}
                          </span>
                        </div>
                        <span className="class-room">
                          <MapPin size={12} />
                          {cls.sala}
                        </span>
                      </div>
                      {isFull && <span className="full-tag">LLENA</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="modal-overlay" onClick={() => setSelectedClass(null)}>
          <div className="modal glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="class-detail-header" style={{ borderLeftColor: selectedClass.color }}>
              <h2 style={{ color: selectedClass.color }}>{selectedClass.nombre}</h2>
              <span className="class-detail-day">{selectedClass.dia}</span>
            </div>
            <div className="class-detail-grid">
              <div className="class-detail-item">
                <Clock size={18} />
                <div>
                  <span className="detail-label">Horario</span>
                  <span className="detail-value">{selectedClass.horaInicio} - {selectedClass.horaFin}</span>
                </div>
              </div>
              <div className="class-detail-item">
                <Users size={18} />
                <div>
                  <span className="detail-label">Instructor</span>
                  <span className="detail-value">{selectedClass.instructor}</span>
                </div>
              </div>
              <div className="class-detail-item">
                <MapPin size={18} />
                <div>
                  <span className="detail-label">Sala</span>
                  <span className="detail-value">{selectedClass.sala}</span>
                </div>
              </div>
              <div className="class-detail-item">
                <Calendar size={18} />
                <div>
                  <span className="detail-label">Ocupación</span>
                  <span className="detail-value">{selectedClass.inscritos} / {selectedClass.capacidad} lugares</span>
                </div>
              </div>
            </div>
            <div className="class-detail-actions">
              <button className="secondary-button" onClick={() => setSelectedClass(null)}>Cerrar</button>
              {selectedClass.inscritos < selectedClass.capacidad && (
                <button className="primary-button">Inscribir Miembro</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
