import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HashRouter as Router, Route, Routes } from 'react-router';

import { UserRole } from './entities/auth';
import { AdminDeveloperPage } from './pages/AdminDeveloperPage';
import { AdminDevelopersPage } from './pages/AdminDevelopersPage';
import { BotPage } from './pages/BotPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocsPage } from './pages/DocsPage';
import { MainPage } from './pages/MainPage';
import { ProfilePage } from './pages/ProfilePage';
import { ServiceUnavailablePage } from './pages/ServiceUnavailablePage';
import { ErrorsProvider, ProtectedRoute } from './shared';

const App = () => {
  return (
    <Router>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <ErrorsProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/login" element={<ServiceUnavailablePage />} />
            <Route path="/register" element={<ServiceUnavailablePage />} />
            <Route path="/create-bot" element={<ServiceUnavailablePage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.DEVELOPER]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bot/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.DEVELOPER]}>
                  <BotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/developers"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDevelopersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/developers/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDeveloperPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorsProvider>
      </MantineProvider>
    </Router>
  );
};

export default App;
