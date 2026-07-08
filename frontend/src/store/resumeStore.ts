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
  markDirty: () => void;
  markSaved: () => void;
  createNewResume: (title?: string) => Resume;
}

// ─── Debounced Local save ─────────────────────────────────────────────────
const debouncedSave = debounce((resume: Resume) => {
  try {
    const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
    localResumes[resume.id] = resume;
    localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));
  } catch (err) {
    console.error('[ResumeStore] Local auto-save failed:', err);
  }
}, 1000);

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

        setCurrentResume: (resume) => {
          set({ currentResume: resume, isDirty: false });
          debouncedSave(resume);
        },

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
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
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
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
          }),

        updateTemplate: (template) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, template };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
          }),

        updateTheme: (theme) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, theme: { ...state.currentResume.theme, ...theme } };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
          }),

        setSectionOrder: (order) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, sectionOrder: order };
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
          }),

        setAtsResult: (atsResult) => set({ atsResult }),

        setThemeMode: (themeMode) => set({ themeMode }),

        setZoomLevel: (zoomLevel) => set({ zoomLevel }),

        markDirty: () => set({ isDirty: true }),

        markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

        createNewResume: (title = 'Untitled Resume') => {
          const resume: Resume = {
            id: uuidv4(),
            userId: 'local-user',
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
          };
          // Save immediately to local storage
          debouncedSave(resume);
          return resume;
        },
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
