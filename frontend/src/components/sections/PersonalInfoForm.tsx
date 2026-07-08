import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { PersonalInfo } from '../../types';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Sparkles } from 'lucide-react';

const FIELDS = [
  { name: 'name', label: 'Full Name', placeholder: 'John Doe', icon: <User size={16} />, required: true },
  { name: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer', icon: <Sparkles size={16} /> },
  { name: 'email', label: 'Email', placeholder: 'john@example.com', icon: <Mail size={16} />, type: 'email' },
  { name: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', icon: <Phone size={16} /> },
  { name: 'address', label: 'Location', placeholder: 'San Francisco, CA', icon: <MapPin size={16} /> },
  { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe', icon: <Linkedin size={16} /> },
  { name: 'github', label: 'GitHub URL', placeholder: 'github.com/johndoe', icon: <Github size={16} /> },
  { name: 'portfolio', label: 'Portfolio URL', placeholder: 'johndoe.dev', icon: <Globe size={16} /> },
  { name: 'website', label: 'Website', placeholder: 'https://johndoe.com', icon: <Globe size={16} /> },
] as const;

export function PersonalInfoForm() {
  const { currentResume, updateSection } = useResumeStore();
  const { register, watch, reset } = useForm<PersonalInfo>({
    defaultValues: currentResume?.sections.personalInfo,
  });

  // Reset when resume changes
  useEffect(() => {
    if (currentResume?.sections.personalInfo) {
      reset(currentResume.sections.personalInfo);
    }
  }, [currentResume?.id, reset]);

  // Watch and auto-save
  useEffect(() => {
    const sub = watch((values) => {
      updateSection('personalInfo', values as PersonalInfo);
    });
    return () => sub.unsubscribe();
  }, [watch, updateSection]);

  return (
    <div className="space-y-5">
      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-4">
        {FIELDS.slice(0, 2).map((field) => (
          <FormField key={field.name} field={field} register={register} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.slice(2, 5).map((field) => (
          <FormField key={field.name} field={field} register={register} />
        ))}
      </div>

      <div className="divider" />
      <h3 className="section-label text-[10px]">SOCIAL LINKS</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.slice(5).map((field) => (
          <FormField key={field.name} field={field} register={register} />
        ))}
      </div>

      <div className="divider" />
      <h3 className="section-label text-[10px]">PROFESSIONAL SUMMARY</h3>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
          <span className="text-xs text-gray-400">
            {watch('summary')?.length || 0} chars
          </span>
        </div>
        <textarea
          {...register('summary')}
          rows={5}
          className="input resize-none"
          placeholder="Write a compelling professional summary that highlights your key achievements and value proposition..."
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">💡 Tip: 30–100 words works best for ATS</span>
        </div>
      </div>
    </div>
  );
}

function FormField({ field, register }: {
  field: typeof FIELDS[number];
  register: ReturnType<typeof useForm<PersonalInfo>>['register'];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {field.label}
        {'required' in field && field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{field.icon}</span>
        <input
          {...register(field.name as keyof PersonalInfo)}
          type={('type' in field && field.type) || 'text'}
          placeholder={field.placeholder}
          className="input pl-10"
        />
      </div>
    </div>
  );
}
