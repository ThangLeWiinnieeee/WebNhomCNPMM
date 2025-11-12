import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { verifyToken, setLoading } from './store/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center full-width-bg">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// App Content Component (cần access Redux hooks)
function AppContent() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Verify token on app load if token exists (after rehydration)
    // This runs after PersistGate has rehydrated the state
    if (token) {
      // Always verify token on app load if it exists
      dispatch(verifyToken());
    } else {
      // Set loading to false if no token
      dispatch(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount after rehydration

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={
        <div className="d-flex justify-content-center align-items-center full-width-bg">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      } persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
