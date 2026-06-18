# 🏋️‍♂️ Planteamiento y Plan de Tareas: GymX

Este documento contiene la planificación completa (Master Task) para la construcción del Sistema de Gestión de Gimnasio (GymX), abarcando desde la arquitectura técnica hasta las funcionalidades finales de cara al usuario.

---

## 1. Visión y Alcance
Desarrollar un software de tipo SaaS (Software as a Service) modular y escalable que optimice la operación diaria de un gimnasio. El sistema administrará miembros, controlará recaudo financiero (membresías, tienda), dará seguimiento a métricas físicas y agendará clases.

---

## 2. Stack Tecnológico (Definido)
- **Frontend / UI:** React interactivo (vite), React-Router-Dom, Lucide Icons, y estilos modernos nativos (CSS puro) orientados a estética *Premium Dark & Neon*.
- **Backend / API (Próximo):** Servidor creado con Node.js y Express (o NestJS para máxima escalabilidad).
- **Base de Datos (Próximo):** MySQL + PHPMyAdmin. Ligera, eficiente y fácil de administrar visualmente para el volumen de datos de un gimnasio.

---

## 3. Arquitectura de Usuarios (Roles)
- 👑 **Administrador:** Acceso completo a finanzas, configuración global, eliminación de datos.
- 🧑‍💼 **Recepcionista:** Limitado a tareas operativas (Check-in, alta de clientes, cobros manuales o POS).
- 🏋️ **Entrenador:** Acceso al área de rutinas de miembros asignados, bitácora de progreso y asistencia de clases.
- 📱 **Miembro (App/Portal):** Vista de su fecha de corte, historial de rutinas, código QR para su acceso y reserva de clases online.

---

## 4. Work Breakdown Structure (Listado de Tareas Master)

### 🟡 FASE 1: Core Administrativo y Setup Base
*Objetivo: Tener la aplicación instalada con el diseño base, un Dashboard, y el sistema central de gestión (CRUD) de clientes.*

- [x] **T-101:** Proveer el entorno frontend (React/Vite).
- [x] **T-102:** Implementar el "Design System" premium y variables CSS globales.
- [x] **T-103:** Crear el Layout Principal interactivo (Sidebar centralizado, TopNav).
- [x] **T-104:** Construir panel visual del UI del "Dashboard Principal" e ilustrar métricas de ejemplo.
- [x] **T-105:** **Módulo de Miembros:** Desarrollar la tabla con filtros (búsqueda y estado de pago) para mostrar los miembros activos.
- [x] **T-106:** **Módulo de Miembros (Formulario):** Crear la interfaz con validaciones atractivas para registrar un alta manual (Nombre, Edad, Correo, Plan Elegido).

### ⚪ FASE 2: Financiero y Accesos Rápidos
*Objetivo: Controlar el dinero y asegurar que nadie sin pagar ingrese a las instalaciones.*

- [x] **T-201:** **Módulo de Cobros:** Crear un historial de "Suscripciones" adosado a cada miembro. Modificar el estado a *'Pagado'*, *'Adeuda'* dinámicamente según la fecha de corte.
- [x] **T-202:** **Control POS (Punto de Venta):** Tablero para cobrar tickets rápidos (ej: "1 Botella de agua", "Día Suelto de Visita") e integrarlo al ingreso diario del Dashboard.
- [x] **T-203:** **Módulo Check-in QR/Manual:** Una vista muy limpia enfocada en tablets donde al ingresar la clave o código numérico del usuario, un panel se torne VERDE (Aprobado) o ROJO (Deuda pendiente).

### ⚪ FASE 3: Clases, Rutinas y Base de datos (Backend real)
*Objetivo: Elevar el sistema entregando interacciones directas al usuario atleta.*

- [x] **T-301:** **Tabla de Clases:** Un calendario semanal tipo cuadrícula de las clases habilitadas (Ej. Lunes 7:00pm - Zumba).
- [x] **T-302:** **Seguimiento Físico:** Tabla de progreso visual dentro del detalle de los clientes mostrando (Peso y Porcentaje de Grasa).
- [x] **T-303:** **Montaje de Backend y Base de Datos (MySQL/PHPMyAdmin):** Transicionar los datos de *Mocks* e interfaces visuales a bases de datos relacionales reales.

---

### 🟢 FASE 4: Autenticación y Control de Acceso por Roles
*Objetivo: Proteger el sistema con login obligatorio y mostrar/ocultar funcionalidades según el rol.*

- [x] **T-401:** **Backend Auth:** Endpoints de registro, login (JWT + bcrypt) y perfil. Middleware de autenticación y autorización por rol.
- [x] **T-402:** **Login UI:** Pantalla de inicio de sesión premium con fondo animado, validaciones, cuentas demo y modo offline/online.
- [x] **T-403:** **Protección de Rutas:** AuthContext, ProtectedRoute y redirección automática a `/login`. TopNav dinámico con usuario y logout.

### 🟢 FASE 5: Conexión Frontend ↔ Backend API
*Objetivo: Transicionar de datos mock a consumo real de la API Express/MySQL con fallback inteligente.*

- [x] **T-501:** **Servicio API Centralizado:** `src/services/api.js` con auth headers, manejo de errores, expiración de token y función `tryAPI` para fallback.
- [x] **T-502:** **Dashboard Dinámico:** Carga stats reales del backend; saluda al usuario logueado por nombre.
- [x] **T-503:** **Módulos Actualizados:** Members, Payments, POS, y Check-in ahora intentan la API primero y caen a datos mock si el backend no está corriendo.

---

## 5. Esquema Recomendado de la Base de Datos (Futuro)
*  `users` (id, rol, nombre, email, password_hash)
*  `memberships` (id, miembro_id, plan_id, fecha_inicio, fecha_fin, estado)
*  `plans` (id, tipo_membresia, precio, duracion_dias)
*  `check_ins` (id, miembro_id, timestamp)
*  `classes` (id, nombre, instructor_id, capacidad, horario_inicio)
*  `transactions` (id, miembro_id, monto, tipo_pago, timestamp)

---
> Nota: Este tablero funcionará como mapa de ruta para ir marcando el progreso a lo largo de las sesiones de código.
 