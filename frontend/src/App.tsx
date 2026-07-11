import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useResumeStore } from './store/resumeStore';
import { FONT_OPTIONS } from './utils/defaults';
import LandingPage from './pages/Landing';
import BuilderPage from './pages/Builder';
import TemplatesPage from './pages/Templates';
import SharedResumePage from './pages/SharedResume';
import FullPreviewPage from './pages/FullPreview';

function ThemeWatcher() {
  const themeMode = useResumeStore((s) => s.themeMode);
  const currentResume = useResumeStore((s) => s.currentResume);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    if (currentResume?.theme?.fontFamily) {
      const fontObj = FONT_OPTIONS.find((f) => f.id === currentResume.theme.fontFamily);
      const fontStyle = fontObj ? fontObj.family : currentResume.theme.fontFamily;
      document.documentElement.style.setProperty('--resume-font', fontStyle);
    }
  }, [currentResume?.theme?.fontFamily]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWatcher />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/preview" element={<FullPreviewPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/r/:shareId" element={<SharedResumePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
