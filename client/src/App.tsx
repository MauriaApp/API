import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { AuthProvider } from './auth/AuthContext'; // Assurez-vous que l'import est correct
import ProtectedRoute from './auth/ProtectedRoute';

const HomePage = lazy(() => import('./pages/Dashboard'));
const AssociationsPage = lazy(() => import('./pages/Associations'));
const UpdatesPage = lazy(() => import('./pages/Updates'));
const LinksPage = lazy(() => import('./pages/Liens'));
const MessagesPage = lazy(() => import('./pages/HomeMessages'));
const LoginPage = lazy(() => import('./pages/Login')); // Assurez-vous d'avoir créé cette page

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            Chargement...
          </div>
        }>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/associations"
              element={
                <ProtectedRoute>
                  <AssociationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messagesHome"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updates"
              element={
                <ProtectedRoute>
                  <UpdatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liens"
              element={
                <ProtectedRoute>
                  <LinksPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  </AuthProvider>
);

export default App;
