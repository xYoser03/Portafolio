const API_URL = 'http://localhost:3001/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('gymx_token');

// Headers con autenticación
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// Wrapper para manejar respuestas
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    // Si el token expiró, limpiar sesión
    if (res.status === 401) {
      localStorage.removeItem('gymx_token');
      localStorage.removeItem('gymx_user');
      window.location.href = '/login';
    }
    throw new Error(data.error || 'Error en la solicitud');
  }
  return data;
};

// =====================================
// AUTH
// =====================================
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders() });
    return handleResponse(res);
  },

  seedAdmin: async () => {
    const res = await fetch(`${API_URL}/auth/seed-admin`, { method: 'POST' });
    return handleResponse(res);
  },
};

// =====================================
// MIEMBROS
// =====================================
export const membersAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/miembros`, { headers: authHeaders() });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/miembros/${id}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  create: async (memberData) => {
    const res = await fetch(`${API_URL}/miembros`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(memberData),
    });
    return handleResponse(res);
  },
};

// =====================================
// PAGOS / MEMBRESÍAS
// =====================================
export const paymentsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/pagos`, { headers: authHeaders() });
    return handleResponse(res);
  },
};

// =====================================
// PRODUCTOS Y VENTAS (POS)
// =====================================
export const productsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/productos`, { headers: authHeaders() });
    return handleResponse(res);
  },

  sell: async (items, metodo_pago, user_id) => {
    const res = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ items, metodo_pago, user_id }),
    });
    return handleResponse(res);
  },
};

// =====================================
// CHECK-IN
// =====================================
export const checkinAPI = {
  register: async (user_id) => {
    const res = await fetch(`${API_URL}/checkin`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ user_id }),
    });
    return handleResponse(res);
  },
};

// =====================================
// CLASES
// =====================================
export const classesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/clases`, { headers: authHeaders() });
    return handleResponse(res);
  },
};

// =====================================
// PROGRESO FÍSICO
// =====================================
export const progressAPI = {
  getByUser: async (userId) => {
    const res = await fetch(`${API_URL}/progreso/${userId}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  create: async (progressData) => {
    const res = await fetch(`${API_URL}/progreso`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(progressData),
    });
    return handleResponse(res);
  },
};

// =====================================
// PLANES
// =====================================
export const plansAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/planes`, { headers: authHeaders() });
    return handleResponse(res);
  },
};

// =====================================
// DASHBOARD
// =====================================
export const dashboardAPI = {
  getStats: async () => {
    const res = await fetch(`${API_URL}/dashboard`, { headers: authHeaders() });
    return handleResponse(res);
  },
};

// =====================================
// HELPER: Intentar API, si falla usar fallback
// =====================================
export const tryAPI = async (apiFn, fallbackData) => {
  try {
    return await apiFn();
  } catch (error) {
    console.warn('⚠️ API no disponible, usando datos locales:', error.message);
    return fallbackData;
  }
};
