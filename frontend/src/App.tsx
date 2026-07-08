import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useResumeStore } from './store/resumeStore';
import LandingPage from './pages/Landing';
import BuilderPage from './pages/Builder';
import TemplatesPage from './pages/Templates';
import SharedResumePage from './pages/SharedResume';

function ThemeWatcher() {
  const themeMode = useResumeStore((s) => s.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [themeMode]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWatcher />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/r/:shareId" element={<SharedResumePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
