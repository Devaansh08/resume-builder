import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type {
  Resume,
  ResumeSections,
  TemplateId,
  ResumeTheme,
  ThemeMode,
  ATSResult,
} from '../types';
import { defaultResumeSections, defaultTheme } from '../utils/defaults';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { debounce, uuidv4 } from '../utils/helpers';

// ─── Store Shape ──────────────────────────────────────────────────────────
interface ResumeStore {
  currentResume: Resume | null;
  resumes: Resume[];
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  atsResult: ATSResult | null;
  themeMode: ThemeMode;
  zoomLevel: number;

  setCurrentResume: (resume: Resume) => void;
  setResumes: (resumes: Resume[]) => void;
  updateSections: (sections: Partial<ResumeSections>) => void;
  updateSection: <K extends keyof ResumeSections>(key: K, value: ResumeSections[K]) => void;
  updateTemplate: (template: TemplateId) => void;
  updateTheme: (theme: Partial<ResumeTheme>) => void;
  setSectionOrder: (order: string[]) => void;
  setAtsResult: (result: ATSResult) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setZoomLevel: (level: number) => void;
  saveToFirestore: () => Promise<void>;
  markDirty: () => void;
  markSaved: () => void;
  createNewResume: (userId: string, title?: string) => Resume;
}

// ─── Debounced Firestore/Local save ───────────────────────────────────────
const debouncedSave = debounce(async (resume: Resume) => {
  // Always update local backup in localStorage so changes are not lost
  try {
    const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
    localResumes[resume.id] = resume;
    localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));
  } catch (err) {
    console.error('[ResumeStore] Local auto-save failed:', err);
  }

  if (resume.userId === 'guest') {
    localStorage.setItem('resumeai_guest_resume', JSON.stringify(resume));
    return;
  }
  try {
    await setDoc(doc(db, 'resumes', resume.id), resume, { merge: true });
  } catch (err) {
    console.error('[ResumeStore] Firestore auto-save failed:', err);
  }
}, 5000);

// ─── Store ────────────────────────────────────────────────────────────────
export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentResume: null,
        resumes: [],
        isDirty: false,
        isSaving: false,
        lastSaved: null,
        atsResult: null,
        themeMode: 'system' as ThemeMode,
        zoomLevel: 100,

        setCurrentResume: (resume) => set({ currentResume: resume, isDirty: false }),

        setResumes: (resumes) => set({ resumes }),

        updateSections: (sections) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = {
              ...state.currentResume,
              sections: { ...state.currentResume.sections, ...sections },
              updatedAt: new Date().toISOString(),
            };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true };
          }),

        updateSection: (key, value) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = {
              ...state.currentResume,
              sections: { ...state.currentResume.sections, [key]: value },
              updatedAt: new Date().toISOString(),
            };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true };
          }),

        updateTemplate: (template) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, template };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true };
          }),

        updateTheme: (theme) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, theme: { ...state.currentResume.theme, ...theme } };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true };
          }),

        setSectionOrder: (order) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, sectionOrder: order };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true };
          }),

        setAtsResult: (atsResult) => set({ atsResult }),

        setThemeMode: (themeMode) => set({ themeMode }),

        setZoomLevel: (zoomLevel) => set({ zoomLevel }),

        saveToFirestore: async () => {
          const { currentResume } = get();
          if (!currentResume) return;
          set({ isSaving: true });
          
          // Always save to localStorage as an instant local backup
          try {
            const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
            localResumes[currentResume.id] = currentResume;
            localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));
          } catch {
            // ignore localStorage quota errors
          }

          if (currentResume.userId === 'guest') {
            localStorage.setItem('resumeai_guest_resume', JSON.stringify(currentResume));
            set({ isSaving: false, isDirty: false, lastSaved: new Date() });
            return;
          }
          try {
            await setDoc(doc(db, 'resumes', currentResume.id), currentResume, { merge: true });
            set({ isSaving: false, isDirty: false, lastSaved: new Date() });
          } catch (err) {
            console.error('[saveToFirestore] Firestore sync failed, saved locally:', err);
            set({ isSaving: false, isDirty: false, lastSaved: new Date() });
          }
        },

        markDirty: () => set({ isDirty: true }),

        markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

        createNewResume: (userId, title = 'Untitled Resume') => ({
          id: uuidv4(),
          userId,
          title,
          template: 'modern' as TemplateId,
          theme: defaultTheme,
          sections: defaultResumeSections(),
          sectionOrder: [
            'personalInfo', 'experience', 'education', 'projects',
            'skills', 'certificates', 'achievements', 'languages',
            'interests', 'references'
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      }),
      {
        name: 'resumeai-store',
        partialize: (state) => ({
          themeMode: state.themeMode,
          zoomLevel: state.zoomLevel,
        }),
      }
    ),
    { name: 'ResumeAI' }
  )
);
