import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Feed from './components/Feed';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const { logout } = useAuth();
  
  return (
    <nav className="nav">
      <div className="nav-content">
        <Link to="/" className="logo">cycl3 ♾️</Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Feed />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
