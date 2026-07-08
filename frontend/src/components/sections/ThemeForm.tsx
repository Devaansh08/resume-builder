import { useResumeStore } from '../../store/resumeStore';
import type { TemplateId } from '../../types';
import { FONT_OPTIONS } from '../../utils/defaults';
import { Palette, Sparkles, Check, LayoutGrid, Type, AlignLeft } from 'lucide-react';

const PRESETS = [
  {
    name: 'Shrine Elegance (Material)',
    desc: 'Material Design Shrine aesthetic. Soft peach backgrounds and deep brown text.',
    template: 'shrine' as TemplateId,
    primaryColor: '#442C2E',
    accentColor: '#FEDBD0',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'normal' as const,
  },
  {
    name: 'Tech & Startups',
    desc: 'Modern and vibrant. Ideal for software engineers and designers.',
    template: 'modern' as TemplateId,
    primaryColor: '#3b5bff',
    accentColor: '#7c3aed',
    fontFamily: 'Inter',
    fontSize: 'normal' as const,
  },
  {
    name: 'Executive & Finance',
    desc: 'Classic and conservative. Best for MBA, banking, and consulting.',
    template: 'professional' as TemplateId,
    primaryColor: '#1e293b',
    accentColor: '#475569',
    fontFamily: 'Merriweather',
    fontSize: 'normal' as const,
  },
  {
    name: 'Academic & Minimalist',
    desc: 'High content density. Best for research and engineering CVs.',
    template: 'minimal' as TemplateId,
    primaryColor: '#09090b',
    accentColor: '#71717a',
    fontFamily: 'Roboto',
    fontSize: 'compact' as const,
  },
  {
    name: 'Creative & Bold',
    desc: 'Eye-catching colors. Perfect for marketing and media roles.',
    template: 'modern' as TemplateId,
    primaryColor: '#ec4899',
    accentColor: '#f43f5e',
    fontFamily: 'Outfit',
    fontSize: 'normal' as const,
  },
];

const COLORS = [
  { label: 'Indigo Blue', primary: '#3b5bff', accent: '#7c3aed' },
  { label: 'Emerald Green', primary: '#10b981', accent: '#059669' },
  { label: 'Slate Dark', primary: '#1e293b', accent: '#475569' },
  { label: 'Crimson Red', primary: '#be123c', accent: '#e11d48' },
  { label: 'Amber Orange', primary: '#d97706', accent: '#f59e0b' },
  { label: 'Deep Pink', primary: '#db2777', accent: '#ec4899' },
];

const TEMPLATES = [
  { id: 'shrine' as TemplateId, name: 'Shrine (Material Pink)' },
  { id: 'modern' as TemplateId, name: 'Modern (2-Column)' },
  { id: 'professional' as TemplateId, name: 'Professional (Classic)' },
  { id: 'minimal' as TemplateId, name: 'Minimal (Contemporary)' },
];

export function ThemeForm() {
  const { currentResume, updateTheme, updateTemplate } = useResumeStore();

  if (!currentResume) return null;

  const theme = currentResume.theme;
  const activeTemplate = currentResume.template;

  const applyPreset = (preset: typeof PRESETS[number]) => {
    updateTemplate(preset.template);
    updateTheme({
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Section 1: Recommended Styles ──────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-brand-500" />
          <h3 className="section-label text-[10px]">RECOMMENDED STYLE PRESETS</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map((p) => {
            const isMatch =
              theme.primaryColor === p.primaryColor &&
              theme.fontFamily === p.fontFamily &&
              activeTemplate === p.template;

            return (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isMatch
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 shadow-glow-sm'
                    : 'border-gray-200 dark:border-surface-800 hover:border-gray-300 dark:hover:border-surface-700 bg-white dark:bg-surface-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm text-gray-900 dark:text-white mb-1">
                  <span>{p.name}</span>
                  {isMatch && <Check size={14} className="text-brand-500" />}
                </div>
                <p className="text-xs text-gray-500 leading-normal">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 2: Templates ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={16} className="text-brand-500" />
          <h3 className="section-label text-[10px]">SELECT TEMPLATE</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {TEMPLATES.map((t) => {
            const isSelected = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateTemplate(t.id)}
                className={`py-3.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                    : 'border-gray-200 dark:border-surface-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 3: Colors ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-brand-500" />
          <h3 className="section-label text-[10px]">COLOR PALETTE</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {COLORS.map((c) => {
            const isSelected = theme.primaryColor === c.primary;
            return (
              <button
                key={c.label}
                onClick={() => updateTheme({ primaryColor: c.primary, accentColor: c.accent })}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                    : 'border-gray-200 dark:border-surface-800 hover:border-gray-300'
                }`}
              >
                <span className="w-5 h-5 rounded-lg flex-shrink-0" style={{ backgroundColor: c.primary }} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{c.label}</span>
                {isSelected && <Check size={12} className="text-brand-500 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 block mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs font-mono uppercase">{theme.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 block mb-1">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs font-mono uppercase">{theme.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 4: Typography (8 Custom Fonts) ────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type size={16} className="text-brand-500" />
          <h3 className="section-label text-[10px]">FONT STYLE (REAL-TIME PREVIEW & PDF)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => {
            const isSelected = theme.fontFamily === f.id;
            return (
              <button
                key={f.id}
                onClick={() => updateTheme({ fontFamily: f.id })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 font-semibold text-brand-600 dark:text-brand-400'
                    : 'border-gray-200 dark:border-surface-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-surface-700'
                }`}
                style={{ fontFamily: f.family }}
              >
                <span>{f.name}</span>
                {isSelected && <Check size={14} className="text-brand-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 5: Font Size / Spacing ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlignLeft size={16} className="text-brand-500" />
          <h3 className="section-label text-[10px]">PAGE LAYOUT SPACING</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['compact', 'normal', 'spacious'] as const).map((sz) => {
            const isSelected = theme.fontSize === sz;
            return (
              <button
                key={sz}
                onClick={() => updateTheme({ fontSize: sz })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize text-center transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                    : 'border-gray-200 dark:border-surface-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
