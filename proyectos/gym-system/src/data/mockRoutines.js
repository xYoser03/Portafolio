// Mock exercises database
const exerciseDB = [
  { id: 1, nombre: 'Press de banca', grupo: 'Pecho' },
  { id: 2, nombre: 'Press inclinado mancuernas', grupo: 'Pecho' },
  { id: 3, nombre: 'Aperturas en polea', grupo: 'Pecho' },
  { id: 4, nombre: 'Sentadilla libre', grupo: 'Piernas' },
  { id: 5, nombre: 'Prensa 45°', grupo: 'Piernas' },
  { id: 6, nombre: 'Extensión de cuádriceps', grupo: 'Piernas' },
  { id: 7, nombre: 'Curl femoral', grupo: 'Piernas' },
  { id: 8, nombre: 'Peso muerto rumano', grupo: 'Piernas' },
  { id: 9, nombre: 'Jalón al pecho', grupo: 'Espalda' },
  { id: 10, nombre: 'Remo con barra', grupo: 'Espalda' },
  { id: 11, nombre: 'Remo en polea baja', grupo: 'Espalda' },
  { id: 12, nombre: 'Press militar', grupo: 'Hombros' },
  { id: 13, nombre: 'Elevaciones laterales', grupo: 'Hombros' },
  { id: 14, nombre: 'Curl con barra', grupo: 'Bíceps' },
  { id: 15, nombre: 'Curl martillo', grupo: 'Bíceps' },
  { id: 16, nombre: 'Press francés', grupo: 'Tríceps' },
  { id: 17, nombre: 'Fondos en paralelas', grupo: 'Tríceps' },
  { id: 18, nombre: 'Crunch abdominal', grupo: 'Core' },
  { id: 19, nombre: 'Plancha', grupo: 'Core' },
  { id: 20, nombre: 'Elevación de piernas', grupo: 'Core' },
];

// Mock routines assigned to members
const mockRoutines = [
  {
    id: 1,
    miembroId: 2,
    miembro: 'Ana Gómez',
    nombre: 'Rutina Full Body - Principiante',
    entrenador: 'Coach Diego',
    createdAt: '2026-04-05',
    dias: [
      {
        dia: 'Lunes - Tren Superior',
        ejercicios: [
          { ejercicioId: 1, nombre: 'Press de banca', series: 3, reps: 12, descanso: '60s' },
          { ejercicioId: 9, nombre: 'Jalón al pecho', series: 3, reps: 12, descanso: '60s' },
          { ejercicioId: 12, nombre: 'Press militar', series: 3, reps: 10, descanso: '60s' },
          { ejercicioId: 14, nombre: 'Curl con barra', series: 3, reps: 12, descanso: '45s' },
          { ejercicioId: 18, nombre: 'Crunch abdominal', series: 3, reps: 20, descanso: '30s' },
        ],
      },
      {
        dia: 'Miércoles - Tren Inferior',
        ejercicios: [
          { ejercicioId: 4, nombre: 'Sentadilla libre', series: 4, reps: 10, descanso: '90s' },
          { ejercicioId: 5, nombre: 'Prensa 45°', series: 3, reps: 12, descanso: '60s' },
          { ejercicioId: 6, nombre: 'Extensión de cuádriceps', series: 3, reps: 15, descanso: '45s' },
          { ejercicioId: 7, nombre: 'Curl femoral', series: 3, reps: 12, descanso: '45s' },
          { ejercicioId: 19, nombre: 'Plancha', series: 3, reps: '45s', descanso: '30s' },
        ],
      },
    ],
  },
  {
    id: 2,
    miembroId: 5,
    miembro: 'Fernando Ruiz',
    nombre: 'Rutina Hipertrofia - Avanzado',
    entrenador: 'Coach Raúl',
    createdAt: '2026-03-20',
    dias: [
      {
        dia: 'Lunes - Pecho y Tríceps',
        ejercicios: [
          { ejercicioId: 1, nombre: 'Press de banca', series: 4, reps: 8, descanso: '90s' },
          { ejercicioId: 2, nombre: 'Press inclinado mancuernas', series: 4, reps: 10, descanso: '60s' },
          { ejercicioId: 3, nombre: 'Aperturas en polea', series: 3, reps: 12, descanso: '45s' },
          { ejercicioId: 16, nombre: 'Press francés', series: 3, reps: 10, descanso: '60s' },
          { ejercicioId: 17, nombre: 'Fondos en paralelas', series: 3, reps: 12, descanso: '60s' },
        ],
      },
      {
        dia: 'Martes - Espalda y Bíceps',
        ejercicios: [
          { ejercicioId: 8, nombre: 'Peso muerto rumano', series: 4, reps: 8, descanso: '120s' },
          { ejercicioId: 10, nombre: 'Remo con barra', series: 4, reps: 10, descanso: '90s' },
          { ejercicioId: 11, nombre: 'Remo en polea baja', series: 3, reps: 12, descanso: '60s' },
          { ejercicioId: 14, nombre: 'Curl con barra', series: 3, reps: 10, descanso: '60s' },
          { ejercicioId: 15, nombre: 'Curl martillo', series: 3, reps: 12, descanso: '45s' },
        ],
      },
      {
        dia: 'Jueves - Piernas',
        ejercicios: [
          { ejercicioId: 4, nombre: 'Sentadilla libre', series: 5, reps: 6, descanso: '120s' },
          { ejercicioId: 5, nombre: 'Prensa 45°', series: 4, reps: 10, descanso: '90s' },
          { ejercicioId: 6, nombre: 'Extensión de cuádriceps', series: 3, reps: 15, descanso: '45s' },
          { ejercicioId: 7, nombre: 'Curl femoral', series: 3, reps: 12, descanso: '45s' },
          { ejercicioId: 20, nombre: 'Elevación de piernas', series: 3, reps: 15, descanso: '30s' },
        ],
      },
    ],
  },
  {
    id: 3,
    miembroId: 8,
    miembro: 'Valentina Torres',
    nombre: 'Rutina Tonificación',
    entrenador: 'Ana Torres',
    createdAt: '2026-04-01',
    dias: [
      {
        dia: 'Lunes - Glúteos y Piernas',
        ejercicios: [
          { ejercicioId: 4, nombre: 'Sentadilla libre', series: 4, reps: 12, descanso: '60s' },
          { ejercicioId: 8, nombre: 'Peso muerto rumano', series: 4, reps: 12, descanso: '60s' },
          { ejercicioId: 7, nombre: 'Curl femoral', series: 3, reps: 15, descanso: '45s' },
          { ejercicioId: 19, nombre: 'Plancha', series: 3, reps: '60s', descanso: '30s' },
        ],
      },
      {
        dia: 'Miércoles - Tren Superior',
        ejercicios: [
          { ejercicioId: 9, nombre: 'Jalón al pecho', series: 3, reps: 12, descanso: '60s' },
          { ejercicioId: 13, nombre: 'Elevaciones laterales', series: 3, reps: 15, descanso: '45s' },
          { ejercicioId: 14, nombre: 'Curl con barra', series: 3, reps: 12, descanso: '45s' },
          { ejercicioId: 18, nombre: 'Crunch abdominal', series: 4, reps: 20, descanso: '30s' },
        ],
      },
    ],
  },
];

// Mock physical progress data per member
const mockProgress = [
  { miembroId: 2, fecha: '2026-01-10', peso: 68.5, grasa: 28, imc: 25.1 },
  { miembroId: 2, fecha: '2026-02-10', peso: 67.2, grasa: 26.5, imc: 24.6 },
  { miembroId: 2, fecha: '2026-03-10', peso: 65.8, grasa: 24.8, imc: 24.1 },
  { miembroId: 2, fecha: '2026-04-10', peso: 64.5, grasa: 23.2, imc: 23.6 },
  { miembroId: 5, fecha: '2026-01-15', peso: 82.0, grasa: 18, imc: 25.8 },
  { miembroId: 5, fecha: '2026-02-15', peso: 83.5, grasa: 17.2, imc: 26.3 },
  { miembroId: 5, fecha: '2026-03-15', peso: 84.2, grasa: 16.5, imc: 26.5 },
  { miembroId: 5, fecha: '2026-04-15', peso: 85.0, grasa: 15.8, imc: 26.7 },
  { miembroId: 8, fecha: '2026-02-01', peso: 60.0, grasa: 25, imc: 22.5 },
  { miembroId: 8, fecha: '2026-03-01', peso: 59.2, grasa: 23.5, imc: 22.2 },
  { miembroId: 8, fecha: '2026-04-01', peso: 58.5, grasa: 22.0, imc: 21.9 },
];

export { exerciseDB, mockRoutines, mockProgress };
