import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { AudioProvider } from './context/AudioContext';
import { MediaProvider } from './context/MediaContext';
import { AuthPage } from './pages/AuthPage';
import { InvitationPage } from './pages/InvitationPage';
import { LandingPage } from './pages/LandingPage';
import { MainPage } from './pages/MainPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ErrorsProvider } from './providers/errors';
import { ApiProvider } from './shared/providers/authInterceptor';
import { WebSocketProvider } from './shared/providers/websocket';

const App = () => {
  return (
    <ApiProvider>
      <MediaProvider>
        <AudioProvider>
          <WebSocketProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <MantineProvider defaultColorScheme="dark">
                <Notifications />

                <ErrorsProvider>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/invite/:code" element={<InvitationPage />} />
                  </Routes>
                </ErrorsProvider>
              </MantineProvider>
            </Router>
          </WebSocketProvider>
        </AudioProvider>
      </MediaProvider>
    </ApiProvider>
  );
};

export default App;
