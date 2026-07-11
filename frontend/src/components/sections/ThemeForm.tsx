import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { TemplateId } from '../../types';
import { FONT_OPTIONS, COLOR_PALETTES } from '../../utils/defaults';
import { Palette, Sparkles, Check, LayoutGrid, Type, AlignLeft } from 'lucide-react';

const PRESETS = [
  {
    name: 'Red & Dark Gradient Executive',
    desc: 'Deep crimson and charcoal contrast. Striking floating dark mode aesthetic.',
    template: 'executive' as TemplateId,
    primaryColor: '#991b1b',
    accentColor: '#18181b',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'normal' as const,
  },
  {
    name: 'Silicon Valley AI Executive',
    desc: 'Modern and vibrant Indigo & Violet. Ideal for AI architects and tech leads.',
    template: 'modern' as TemplateId,
    primaryColor: '#3b5bff',
    accentColor: '#7c3aed',
    fontFamily: 'Inter',
    fontSize: 'normal' as const,
  },
  {
    name: 'Wall Street Investment Banker',
    desc: 'Classic serif typography in Slate Executive. Best for M&A, banking, and law.',
    template: 'professional' as TemplateId,
    primaryColor: '#1e293b',
    accentColor: '#475569',
    fontFamily: 'Merriweather',
    fontSize: 'normal' as const,
  },
  {
    name: 'Academic & Research Scientist',
    desc: 'Ultra high content density in Monochrome Prestige. Perfect for PhDs and R&D.',
    template: 'minimal' as TemplateId,
    primaryColor: '#18181b',
    accentColor: '#52525b',
    fontFamily: 'Roboto',
    fontSize: 'compact' as const,
  },
  {
    name: 'Global CMO / Creative Brand',
    desc: 'Eye-catching Rose & Orange gradients. Perfect for marketing and growth directors.',
    template: 'modern' as TemplateId,
    primaryColor: '#f43f5e',
    accentColor: '#fb923c',
    fontFamily: 'Outfit',
    fontSize: 'normal' as const,
  },
  {
    name: 'Cyberpunk Neon Studio',
    desc: 'Futuristic Cyan & Purple contrasts. Stand out in game dev and Web3 applications.',
    template: 'modern' as TemplateId,
    primaryColor: '#06b6d4',
    accentColor: '#a855f7',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'normal' as const,
  },
  {
    name: 'Google Engineering Standard',
    desc: 'Clean, structured, and ATS-optimized. Inspired by standard Google resume formatting.',
    template: 'google' as TemplateId,
    primaryColor: '#2563eb',
    accentColor: '#10b981',
    fontFamily: 'Roboto',
    fontSize: 'normal' as const,
  },
  {
    name: 'Harvard Academic Classic',
    desc: 'Traditional crimson headers with high contrast hierarchy for prestigious institutions.',
    template: 'harvard' as TemplateId,
    primaryColor: '#be123c',
    accentColor: '#4f46e5',
    fontFamily: 'Playfair Display',
    fontSize: 'normal' as const,
  },
  {
    name: 'Nordic Clean & Spacious',
    desc: 'Minimalist Nordic Ice blue and teal accents with generous whitespace and calm balance.',
    template: 'minimal' as TemplateId,
    primaryColor: '#0284c7',
    accentColor: '#0d9488',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'spacious' as const,
  },
  {
    name: 'Obsidian Prestige Gold',
    desc: 'Luxurious dark charcoal headers coupled with warm amber gold accents.',
    template: 'professional' as TemplateId,
    primaryColor: '#27272a',
    accentColor: '#eab308',
    fontFamily: 'EB Garamond',
    fontSize: 'normal' as const,
  },
  {
    name: 'Executive Bold Navy',
    desc: 'Bold centered header with navy ink. Perfect for C-suite and senior leadership applications.',
    template: 'executive' as TemplateId,
    primaryColor: '#1A1A3E',
    accentColor: '#C41E3A',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'normal' as const,
  },
];

const TEMPLATES_LIST = [
  { id: 'modern' as TemplateId, name: 'Modern (2-Column)' },
  { id: 'professional' as TemplateId, name: 'Professional (Classic)' },
  { id: 'minimal' as TemplateId, name: 'Minimal (Clean)' },
  { id: 'google' as TemplateId, name: 'Google Style (ATS)' },
  { id: 'harvard' as TemplateId, name: 'Harvard (Crimson)' },
  { id: 'stanford' as TemplateId, name: 'Stanford (Academic)' },
  { id: 'microsoft' as TemplateId, name: 'Microsoft (Corporate)' },
  { id: 'creative' as TemplateId, name: 'Creative (Sidebar)' },
  { id: 'executive' as TemplateId, name: 'Executive (Bold)' },
  { id: 'shrine' as TemplateId, name: 'Shrine (Material Pink)' },
  { id: 'indian-academic' as TemplateId, name: 'Indian Academic (Tabular)' },
  { id: 'indian-corporate' as TemplateId, name: 'Indian Corporate (Sidebar)' },
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
    <div className="space-y-8 animate-fade-in pb-8">
      {/* ── Section 1: Recommended Presets ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-500" />
            <h3 className="section-label text-[11px] font-bold tracking-wider uppercase text-gray-800 dark:text-gray-200">
              Curated Design Presets (10 Complete Themes)
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">One-click styling</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map((p) => {
            const isMatch =
              theme.primaryColor.toLowerCase() === p.primaryColor.toLowerCase() &&
              activeTemplate === p.template;

            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 group relative overflow-hidden ${
                  isMatch
                    ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-glow-sm'
                    : 'border-gray-200 dark:border-surface-800 hover:border-brand-400/80 dark:hover:border-surface-700 bg-white dark:bg-surface-900 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm text-gray-900 dark:text-white mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10" style={{ backgroundColor: p.primaryColor }} />
                    <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{p.name}</span>
                  </div>
                  {isMatch && <Check size={16} className="text-brand-500 flex-shrink-0 animate-scale-up" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-5">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 2: Templates Selection ─────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={16} className="text-brand-500" />
          <h3 className="section-label text-[11px] font-bold tracking-wider uppercase text-gray-800 dark:text-gray-200">
            Select Template Layout (12 Formats)
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TEMPLATES_LIST.map((t) => {
            const isSelected = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateTemplate(t.id)}
                className={`py-3.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm ring-1 ring-brand-500/50'
                    : 'border-gray-200 dark:border-surface-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700 hover:bg-gray-50/50'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 3: 16+ Color Palettes ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-brand-500" />
            <h3 className="section-label text-[11px] font-bold tracking-wider uppercase text-gray-800 dark:text-gray-200">
              16+ Executive & Creative Color Palettes
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {COLOR_PALETTES.map((c) => {
            const isSelected = theme.primaryColor.toLowerCase() === c.primary.toLowerCase();
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => updateTheme({ primaryColor: c.primary, accentColor: c.accent })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all group ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 ring-1 ring-brand-500/40 shadow-sm'
                    : 'border-gray-200 dark:border-surface-800 hover:border-gray-300 dark:hover:border-surface-700 bg-white dark:bg-surface-900'
                }`}
              >
                <div className="flex -space-x-1 flex-shrink-0">
                  <span className="w-5 h-5 rounded-full border border-white dark:border-surface-800 shadow-sm" style={{ backgroundColor: c.primary }} />
                  <span className="w-5 h-5 rounded-full border border-white dark:border-surface-800 shadow-sm" style={{ backgroundColor: c.accent }} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                  {c.label}
                </span>
                {isSelected && <Check size={14} className="text-brand-500 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker */}
        <div className="mt-4 p-4 rounded-xl bg-gray-50/70 dark:bg-surface-800/50 border border-gray-200/60 dark:border-surface-700/60 grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Custom Primary Color</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 dark:border-surface-700 shadow-sm"
              />
              <span className="text-xs font-mono uppercase font-semibold text-gray-800 dark:text-gray-200">{theme.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Custom Accent Color</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 dark:border-surface-700 shadow-sm"
              />
              <span className="text-xs font-mono uppercase font-semibold text-gray-800 dark:text-gray-200">{theme.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 4: Typography & Font Style Selection ───────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-brand-500" />
            <h3 className="section-label text-[11px] font-bold tracking-wider uppercase text-gray-800 dark:text-gray-200">
              Typography & Font Style (Applies to Whole Page)
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">16+ Google & Classic Fonts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FONT_OPTIONS.map((f) => {
            const isSelected = theme.fontFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => updateTheme({ fontFamily: f.id })}
                style={{ fontFamily: f.family }}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/40 shadow-sm'
                    : 'border-gray-200 dark:border-surface-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-surface-700 bg-white dark:bg-surface-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold truncate">{f.id}</span>
                  {isSelected && <Check size={14} className="text-brand-500 flex-shrink-0 ml-1" />}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-1">
                  {f.name.split(' (')[1]?.replace(')', '') || 'Classic font'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ── Section 5: Page Spacing & Layout Density ───────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlignLeft size={16} className="text-brand-500" />
          <h3 className="section-label text-[11px] font-bold tracking-wider uppercase text-gray-800 dark:text-gray-200">
            Page Layout & Spacing Density
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['compact', 'normal', 'spacious'] as const).map((sz) => {
            const isSelected = theme.fontSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => updateTheme({ fontSize: sz })}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold capitalize text-center transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm ring-1 ring-brand-500/40'
                    : 'border-gray-200 dark:border-surface-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700'
                }`}
              >
                {sz} Spacing
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
