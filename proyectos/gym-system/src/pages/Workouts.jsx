import { useState } from 'react';
import { Dumbbell, ChevronDown, ChevronRight, TrendingDown, TrendingUp, User, Weight, Percent } from 'lucide-react';
import { mockRoutines, mockProgress } from '../data/mockRoutines';
import './Workouts.css';

const Workouts = () => {
  const [routines] = useState(mockRoutines);
  const [expandedRoutine, setExpandedRoutine] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const toggleRoutine = (id) => {
    setExpandedRoutine(expandedRoutine === id ? null : id);
    setExpandedDay(null);
  };

  const toggleDay = (dayName) => {
    setExpandedDay(expandedDay === dayName ? null : dayName);
  };

  const memberProgress = selectedMember
    ? mockProgress.filter(p => p.miembroId === selectedMember)
    : [];

  const membersWithProgress = [...new Set(mockProgress.map(p => p.miembroId))];
  const memberNames = {
    2: 'Ana Gómez',
    5: 'Fernando Ruiz',
    8: 'Valentina Torres',
  };

  return (
    <div className="workouts-page">
      <div className="workouts-header animate-slide-up">
        <div>
          <h1 className="page-title">Rutinas y Progreso</h1>
          <p className="page-subtitle">Rutinas asignadas y seguimiento físico de los miembros.</p>
        </div>
      </div>

      <div className="workouts-layout">
        {/* Routines List */}
        <div className="workouts-list animate-slide-up delay-100">
          <h3 className="section-title">
            <Dumbbell size={18} />
            Rutinas Asignadas
          </h3>

          <div className="routines-accordion">
            {routines.map(routine => (
              <div key={routine.id} className="routine-item glass-panel">
                <div className="routine-header" onClick={() => toggleRoutine(routine.id)}>
                  <div className="routine-info">
                    <span className="routine-name">{routine.nombre}</span>
                    <span className="routine-meta">
                      <User size={12} /> {routine.miembro} · {routine.entrenador} · {routine.dias.length} días
                    </span>
                  </div>
                  {expandedRoutine === routine.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>

                {expandedRoutine === routine.id && (
                  <div className="routine-days">
                    {routine.dias.map(day => (
                      <div key={day.dia} className="routine-day">
                        <div className="day-header" onClick={() => toggleDay(day.dia)}>
                          <span className="day-name">{day.dia}</span>
                          <span className="day-exercises-count">{day.ejercicios.length} ejercicios</span>
                        </div>

                        {expandedDay === day.dia && (
                          <table className="exercises-table">
                            <thead>
                              <tr>
                                <th>Ejercicio</th>
                                <th>Series</th>
                                <th>Reps</th>
                                <th>Descanso</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.ejercicios.map((ej, i) => (
                                <tr key={i}>
                                  <td className="exercise-name">{ej.nombre}</td>
                                  <td className="exercise-val">{ej.series}</td>
                                  <td className="exercise-val">{ej.reps}</td>
                                  <td className="exercise-val">{ej.descanso}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="progress-panel glass-panel animate-slide-up delay-200">
          <h3 className="section-title">
            <TrendingDown size={18} />
            Seguimiento Físico
          </h3>

          <div className="progress-member-select">
            <label>Seleccionar miembro:</label>
            <select
              value={selectedMember || ''}
              onChange={(e) => setSelectedMember(Number(e.target.value) || null)}
            >
              <option value="">-- Elegir --</option>
              {membersWithProgress.map(id => (
                <option key={id} value={id}>{memberNames[id]}</option>
              ))}
            </select>
          </div>

          {memberProgress.length > 0 ? (
            <>
              {/* Visual Progress Cards */}
              <div className="progress-summary">
                {(() => {
                  const first = memberProgress[0];
                  const last = memberProgress[memberProgress.length - 1];
                  const weightDiff = (last.peso - first.peso).toFixed(1);
                  const fatDiff = (last.grasa - first.grasa).toFixed(1);
                  return (
                    <>
                      <div className="progress-stat">
                        <Weight size={18} />
                        <div>
                          <span className="prog-label">Peso actual</span>
                          <span className="prog-value">{last.peso} kg</span>
                          <span className={`prog-diff ${Number(weightDiff) < 0 ? 'prog-good' : 'prog-bad'}`}>
                            {Number(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
                          </span>
                        </div>
                      </div>
                      <div className="progress-stat">
                        <Percent size={18} />
                        <div>
                          <span className="prog-label">% Grasa</span>
                          <span className="prog-value">{last.grasa}%</span>
                          <span className={`prog-diff ${Number(fatDiff) < 0 ? 'prog-good' : 'prog-bad'}`}>
                            {Number(fatDiff) > 0 ? '+' : ''}{fatDiff}%
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Progress Timeline */}
              <div className="progress-timeline">
                <h4>Historial de mediciones</h4>
                {memberProgress.map((entry, i) => (
                  <div key={i} className="timeline-entry">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">{entry.fecha}</span>
                      <div className="timeline-values">
                        <span>{entry.peso} kg</span>
                        <span>{entry.grasa}% grasa</span>
                        <span>IMC {entry.imc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple Bar Chart for weight */}
              <div className="progress-chart">
                <h4>Evolución de peso</h4>
                <div className="weight-bars">
                  {memberProgress.map((entry, i) => {
                    const minW = Math.min(...memberProgress.map(e => e.peso)) - 2;
                    const maxW = Math.max(...memberProgress.map(e => e.peso)) + 2;
                    const pct = ((entry.peso - minW) / (maxW - minW)) * 100;
                    return (
                      <div key={i} className="weight-bar-row">
                        <span className="weight-bar-label">{entry.fecha.slice(5)}</span>
                        <div className="weight-bar-track">
                          <div className="weight-bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="weight-bar-value">{entry.peso}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="progress-empty">
              <User size={40} />
              <p>Selecciona un miembro para ver su evolución física.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
