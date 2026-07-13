import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import type {
  Resume,
  ResumeSections,
  TemplateId,
  ResumeTheme,
  ThemeMode,
  ATSResult,
} from '../types';
import { defaultResumeSections, defaultTheme, defaultSectionTitles } from '../utils/defaults';
import { softwareEngineerSample, productManagerSample, financialAnalystSample, indianFresherSample, blankResumeSample } from '../utils/sampleResumes';
import { debounce, uuidv4 } from '../utils/helpers';

// ─── Store Shape ──────────────────────────────────────────────────────────
interface ResumeStore {
  currentResume: Resume | null;
  resumes: Resume[];
  history: string[];
  historyIndex: number;
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
  updateSectionTitle: (sectionKey: string, newTitle: string) => void;
  updateTemplate: (template: TemplateId) => void;
  updateTheme: (theme: Partial<ResumeTheme>) => void;
  setSectionOrder: (order: string[]) => void;
  setAtsResult: (result: ATSResult) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setZoomLevel: (level: number) => void;
  markDirty: () => void;
  markSaved: () => void;
  createNewResume: (title?: string, sampleType?: 'software' | 'product' | 'finance' | 'fresher' | 'blank') => Resume;
  updateResumeTitle: (title: string) => void;
  loadSampleResume: (type: 'software' | 'product' | 'finance' | 'fresher' | 'blank') => void;
  undo: () => void;
  redo: () => void;
}

// ─── Debounced Local save ─────────────────────────────────────────────────
const debouncedSave = debounce((resume: Resume) => {
  try {
    const raw = localStorage.getItem('resumeai_saved_resumes');
    const list: Resume[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((r) => r.id === resume.id);
    if (idx >= 0) list[idx] = resume;
    else list.push(resume);
    localStorage.setItem('resumeai_saved_resumes', JSON.stringify(list));
  } catch (err) {
    console.error('[ResumeStore] Local auto-save failed:', err);
  }
}, 1000);

// Helper for history push
function pushSnapshot(history: string[], index: number, resume: Resume) {
  const serialized = JSON.stringify(resume);
  const sliced = history.slice(0, index + 1);
  if (sliced[sliced.length - 1] === serialized) {
    return { history: sliced, historyIndex: sliced.length - 1 };
  }
  sliced.push(serialized);
  if (sliced.length > 30) sliced.shift();
  return { history: sliced, historyIndex: sliced.length - 1 };
}

// ─── Store ────────────────────────────────────────────────────────────────
export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentResume: null,
        resumes: [],
        history: [],
        historyIndex: -1,
        isDirty: false,
        isSaving: false,
        lastSaved: null,
        atsResult: null,
        themeMode: 'light' as ThemeMode,
        zoomLevel: 100,

        setCurrentResume: (resume) => {
          if (!resume.sectionTitles) {
            resume.sectionTitles = { ...defaultSectionTitles };
          }
          const { history, historyIndex } = pushSnapshot([], -1, resume);
          set({ currentResume: resume, history, historyIndex, isDirty: false });
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
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        updateSection: (key, value) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = {
              ...state.currentResume,
              sections: { ...state.currentResume.sections, [key]: value },
              updatedAt: new Date().toISOString(),
            };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        updateSectionTitle: (sectionKey, newTitle) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updatedTitles = {
              ...(state.currentResume.sectionTitles || { ...defaultSectionTitles }),
              [sectionKey]: newTitle,
            };
            const updated = {
              ...state.currentResume,
              sectionTitles: updatedTitles,
              updatedAt: new Date().toISOString(),
            };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        updateTemplate: (template) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, template };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        updateTheme: (theme) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, theme: { ...state.currentResume.theme, ...theme } };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        setSectionOrder: (order) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = { ...state.currentResume, sectionOrder: order };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        setAtsResult: (atsResult) => set({ atsResult }),

        setThemeMode: (themeMode) => set({ themeMode }),

        setZoomLevel: (zoomLevel) => set({ zoomLevel }),

        markDirty: () => set({ isDirty: true }),

        markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

        createNewResume: (title = 'Alex Rivera — Software Architect', sampleType: 'software' | 'product' | 'finance' | 'fresher' | 'blank' = 'software') => {
          let sections = softwareEngineerSample();
          if (sampleType === 'product') sections = productManagerSample();
          else if (sampleType === 'finance') sections = financialAnalystSample();
          else if (sampleType === 'fresher') sections = indianFresherSample();
          else if (sampleType === 'blank') {
            sections = blankResumeSample();
            if (title === 'Alex Rivera — Software Architect') title = 'Untitled Fresh Resume';
          }

          const resume: Resume = {
            id: uuidv4(),
            userId: 'local-user',
            title,
            template: 'modern' as TemplateId,
            theme: defaultTheme,
            sections,
            sectionOrder: [
              'personalInfo', 'experience', 'education', 'projects',
              'skills', 'certificates', 'achievements', 'languages',
              'interests', 'references'
            ],
            sectionTitles: { ...defaultSectionTitles },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          debouncedSave(resume);
          return resume;
        },

        updateResumeTitle: (title) =>
          set((state) => {
            if (!state.currentResume) return state;
            const updated = {
              ...state.currentResume,
              title,
              updatedAt: new Date().toISOString(),
            };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        loadSampleResume: (type) =>
          set((state) => {
            let sections = softwareEngineerSample();
            let title = 'Alex Rivera — Software Architect';
            if (type === 'product') {
              sections = productManagerSample();
              title = 'Sarah Jenkins — VP Product Management';
            } else if (type === 'finance') {
              sections = financialAnalystSample();
              title = 'David Chen — Lead Financial Analyst';
            } else if (type === 'fresher') {
              sections = indianFresherSample();
              title = 'Aarav Sharma — SDE Graduate';
            } else if (type === 'blank') {
              sections = blankResumeSample();
              title = 'Untitled Fresh Resume';
            }

            const updated: Resume = state.currentResume
              ? {
                  ...state.currentResume,
                  title,
                  sections,
                  sectionTitles: state.currentResume.sectionTitles || { ...defaultSectionTitles },
                  updatedAt: new Date().toISOString(),
                }
              : {
                  id: uuidv4(),
                  userId: 'local-user',
                  title,
                  template: 'modern' as TemplateId,
                  theme: defaultTheme,
                  sections,
                  sectionOrder: [
                    'personalInfo', 'experience', 'education', 'projects',
                    'skills', 'certificates', 'achievements', 'languages',
                    'interests', 'references'
                  ],
                  sectionTitles: { ...defaultSectionTitles },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
            const { history, historyIndex } = pushSnapshot(state.history, state.historyIndex, updated);
            debouncedSave(updated);
            return { currentResume: updated, history, historyIndex, isDirty: true, lastSaved: new Date() };
          }),

        undo: () =>
          set((state) => {
            if (state.historyIndex <= 0 || !state.history.length) return state;
            const newIndex = state.historyIndex - 1;
            try {
              const previousState: Resume = JSON.parse(state.history[newIndex]);
              debouncedSave(previousState);
              return { currentResume: previousState, historyIndex: newIndex, isDirty: true, lastSaved: new Date() };
            } catch (err) {
              console.error('[ResumeStore] Undo failed:', err);
              return state;
            }
          }),

        redo: () =>
          set((state) => {
            if (state.historyIndex >= state.history.length - 1 || state.historyIndex < 0 || !state.history.length) return state;
            const newIndex = state.historyIndex + 1;
            try {
              const nextState: Resume = JSON.parse(state.history[newIndex]);
              debouncedSave(nextState);
              return { currentResume: nextState, historyIndex: newIndex, isDirty: true, lastSaved: new Date() };
            } catch (err) {
              console.error('[ResumeStore] Redo failed:', err);
              return state;
            }
          }),
      }),
      {
        name: 'resumeai-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          themeMode: state.themeMode,
          zoomLevel: state.zoomLevel,
          currentResume: state.currentResume,
        }),
      }
    ),
    { name: 'ResumeAI' }
  )
);
