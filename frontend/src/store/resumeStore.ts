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
        themeMode: 'light' as ThemeMode,
        zoomLevel: 100,

        setCurrentResume: (resume) => {
          if (!resume.sectionTitles) {
            resume.sectionTitles = { ...defaultSectionTitles };
          }
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
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
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
            debouncedSave(updated);
            return { currentResume: updated, isDirty: true, lastSaved: new Date() };
          }),
      }),
      {
        name: 'resumeai-store',
        storage: createJSONStorage(() => sessionStorage),
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
