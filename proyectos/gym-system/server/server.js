const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./db');
const { authMiddleware, requireRole, generateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =====================================
// HEALTH CHECK
// =====================================
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

// =====================================
// AUTH - REGISTRO / LOGIN
// =====================================

// Registro de nuevos usuarios del staff (solo admins pueden crear staff)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar que el email no exista
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario
    const validRoles = ['admin', 'recepcionista', 'entrenador'];
    const userRol = validRoles.includes(rol) ? rol : 'recepcionista';

    const [result] = await pool.query(
      'INSERT INTO users (nombre, email, telefono, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono || null, password_hash, userRol]
    );

    const token = generateToken({ id: result.insertId, nombre, email, rol: userRol });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      token,
      user: { id: result.insertId, nombre, email, rol: userRol },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const [users] = await pool.query(
      'SELECT id, nombre, email, password_hash, rol FROM users WHERE email = ? AND activo = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener perfil del usuario autenticado
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, nombre, email, telefono, rol, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear admin por defecto (ejecutar una sola vez)
app.post('/api/auth/seed-admin', async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE rol = 'admin' LIMIT 1");
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un administrador' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    await pool.query(
      "INSERT INTO users (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)",
      ['Administrador', 'admin@gymx.com', password_hash, 'admin']
    );

    res.status(201).json({
      message: 'Admin creado exitosamente',
      credentials: { email: 'admin@gymx.com', password: 'admin123' },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// MIEMBROS (Users con rol 'miembro')
// =====================================
app.get('/api/miembros', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.*, 
        m.plan_id, m.fecha_inicio, m.fecha_fin, m.estado AS estado_membresia,
        p.nombre AS plan_nombre,
        (SELECT COUNT(*) FROM check_ins ci WHERE ci.user_id = u.id) AS asistencias
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id AND m.id = (
        SELECT MAX(m2.id) FROM memberships m2 WHERE m2.user_id = u.id
      )
      LEFT JOIN plans p ON m.plan_id = p.id
      WHERE u.rol = 'miembro'
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/miembros', async (req, res) => {
  try {
    const { nombre, email, telefono, edad, genero, plan_id, metodo_pago } = req.body;

    // Crear usuario
    const [userResult] = await pool.query(
      'INSERT INTO users (nombre, email, telefono, edad, genero, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, email, telefono, edad, genero, 'temp_hash', 'miembro']
    );

    const userId = userResult.insertId;

    // Obtener plan para calcular fecha fin
    const [plans] = await pool.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
    if (plans.length === 0) return res.status(400).json({ error: 'Plan no encontrado' });

    const plan = plans[0];
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias);

    // Crear membresía
    await pool.query(
      'INSERT INTO memberships (user_id, plan_id, fecha_inicio, fecha_fin, estado, metodo_pago, monto_pagado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, plan_id, fechaInicio, fechaFin, 'Activo', metodo_pago || 'Efectivo', plan.precio]
    );

    res.status(201).json({ id: userId, message: 'Miembro registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/miembros/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.*,
        m.plan_id, m.fecha_inicio, m.fecha_fin, m.estado AS estado_membresia, m.monto_pagado,
        p.nombre AS plan_nombre
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id AND m.id = (
        SELECT MAX(m2.id) FROM memberships m2 WHERE m2.user_id = u.id
      )
      LEFT JOIN plans p ON m.plan_id = p.id
      WHERE u.id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Miembro no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// CHECK-IN
// =====================================
app.post('/api/checkin', async (req, res) => {
  try {
    const { user_id } = req.body;

    // Verificar que el miembro existe y tiene membresía activa
    const [members] = await pool.query(`
      SELECT u.nombre, m.estado, m.fecha_fin
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id AND m.id = (
        SELECT MAX(m2.id) FROM memberships m2 WHERE m2.user_id = u.id
      )
      WHERE u.id = ?
    `, [user_id]);

    if (members.length === 0) {
      return res.status(404).json({ type: 'not-found' });
    }

    const member = members[0];

    if (member.estado === 'Vencido') {
      return res.status(403).json({ type: 'denied', member });
    }

    // Registrar check-in
    await pool.query('INSERT INTO check_ins (user_id) VALUES (?)', [user_id]);

    res.json({ type: 'success', member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// PAGOS / MEMBRESÍAS
// =====================================
app.get('/api/pagos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, u.nombre AS miembro, p.nombre AS plan_nombre
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      JOIN plans p ON m.plan_id = p.id
      ORDER BY m.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// PRODUCTOS (POS)
// =====================================
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE activo = TRUE');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ventas', async (req, res) => {
  try {
    const { items, metodo_pago, user_id } = req.body;
    const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const [txResult] = await pool.query(
      'INSERT INTO transactions (user_id, monto_total, metodo_pago) VALUES (?, ?, ?)',
      [user_id || null, total, metodo_pago || 'Efectivo']
    );

    const txId = txResult.insertId;

    for (const item of items) {
      await pool.query(
        'INSERT INTO transaction_items (transaction_id, product_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [txId, item.id, item.cantidad, item.precio]
      );
      // Actualizar stock
      await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.cantidad, item.id]);
    }

    res.status(201).json({ id: txId, total, message: 'Venta registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// CLASES
// =====================================
app.get('/api/clases', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.nombre AS instructor,
        (SELECT COUNT(*) FROM class_enrollments ce WHERE ce.class_id = c.id) AS inscritos
      FROM classes c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.activo = TRUE
      ORDER BY FIELD(c.dia, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'), c.hora_inicio
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// PROGRESO FÍSICO
// =====================================
app.get('/api/progreso/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM physical_progress WHERE user_id = ? ORDER BY fecha ASC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/progreso', async (req, res) => {
  try {
    const { user_id, peso, porcentaje_grasa, imc, notas } = req.body;
    const fecha = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO physical_progress (user_id, fecha, peso, porcentaje_grasa, imc, notas) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, fecha, peso, porcentaje_grasa, imc, notas]
    );

    res.status(201).json({ message: 'Medición registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// PLANES
// =====================================
app.get('/api/planes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM plans WHERE activo = TRUE');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// DASHBOARD STATS
// =====================================
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ totalMiembros }]] = await pool.query("SELECT COUNT(*) AS totalMiembros FROM users WHERE rol = 'miembro' AND activo = TRUE");
    const [[{ activos }]] = await pool.query("SELECT COUNT(*) AS activos FROM memberships WHERE estado = 'Activo'");
    const [[{ ingresosMes }]] = await pool.query("SELECT COALESCE(SUM(monto_pagado), 0) AS ingresosMes FROM memberships WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())");
    const [[{ checkinHoy }]] = await pool.query("SELECT COUNT(*) AS checkinHoy FROM check_ins WHERE DATE(fecha_hora) = CURDATE()");

    res.json({ totalMiembros, activos, ingresosMes, checkinHoy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// START SERVER
// =====================================
app.listen(PORT, () => {
  console.log(`\n🏋️ GymX API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
