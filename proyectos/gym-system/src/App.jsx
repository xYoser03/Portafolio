import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Payments from './pages/Payments';
import POS from './pages/POS';
import CheckIn from './pages/CheckIn';
import Classes from './pages/Classes';
import Workouts from './pages/Workouts';
import Login from './pages/Login';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopNav />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/miembros" element={<Members />} />
            <Route path="/cobros" element={<Payments />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/clases" element={<Classes />} />
            <Route path="/rutinas" element={<Workouts />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0a0b', color: '#d4ff00',
        fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem',
      }}>
        Cargando GymX...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

