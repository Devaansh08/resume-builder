import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { PersonalInfo } from '../../types';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Sparkles, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { WYSIWYGEditor } from '../builder/WYSIWYGEditor';
import { SectionTitleEditor } from '../builder/SectionTitleEditor';

const FIELDS = [
  { name: 'name', label: 'Full Name', placeholder: 'John Doe', icon: <User size={16} />, required: true },
  { name: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer', icon: <Sparkles size={16} /> },
  { 
    name: 'email', 
    label: 'Email', 
    placeholder: 'john@example.com', 
    icon: <Mail size={16} />, 
    type: 'email',
    validation: {
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        message: "Must be a valid email"
      }
    }
  },
  { name: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', icon: <Phone size={16} /> },
  { name: 'address', label: 'Location', placeholder: 'San Francisco, CA', icon: <MapPin size={16} /> },
  { 
    name: 'linkedin', 
    label: 'LinkedIn URL', 
    placeholder: 'linkedin.com/in/johndoe', 
    icon: <Linkedin size={16} />,
    validation: {
      pattern: {
        value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i,
        message: "Must contain linkedin.com"
      }
    }
  },
  { 
    name: 'github', 
    label: 'GitHub URL', 
    placeholder: 'github.com/johndoe', 
    icon: <Github size={16} />,
    validation: {
      pattern: {
        value: /^(https?:\/\/)?(www\.)?github\.com\/.*$/i,
        message: "Must contain github.com"
      }
    }
  },
  { 
    name: 'portfolio', 
    label: 'Portfolio URL', 
    placeholder: 'johndoe.dev', 
    icon: <Globe size={16} />,
    validation: {
      pattern: {
        value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i,
        message: "Must be a valid URL"
      }
    }
  },
  { 
    name: 'website', 
    label: 'Website', 
    placeholder: 'https://johndoe.com', 
    icon: <Globe size={16} />,
    validation: {
      pattern: {
        value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i,
        message: "Must be a valid URL"
      }
    }
  },
];

export function PersonalInfoForm() {
  const { currentResume, updateSection } = useResumeStore();
  const { register, watch, reset, setValue, formState: { errors } } = useForm<PersonalInfo>({
    defaultValues: currentResume?.sections.personalInfo,
    mode: 'onChange',
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoVal = watch('photo');

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setValue('photo', dataUrl);
          updateSection('personalInfo', { ...watch(), photo: dataUrl } as PersonalInfo);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleRemovePhoto = () => {
    setValue('photo', '');
    updateSection('personalInfo', { ...watch(), photo: '' } as PersonalInfo);
  };

  return (
    <div className="space-y-6">
      {/* ── Profile Photo Upload Area ── */}
      <div className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-surface-800 border-2 border-brand-500/20 flex items-center justify-center flex-shrink-0 relative">
            {photoVal ? (
              <img src={photoVal} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={24} className="text-gray-400 dark:text-gray-600" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Profile Photo</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Recommended for creative, European, or modern resume styles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/png,image/jpeg,image/webp"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }}
          />
          {photoVal ? (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 btn-sm gap-1.5"
            >
              <Trash2 size={14} /> Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="btn btn-secondary btn-sm gap-1.5"
            >
              <Upload size={14} /> Upload Photo
            </button>
          )}
        </div>
      </div>

      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-4">
        {FIELDS.slice(0, 2).map((field) => (
          <FormField key={field.name} field={field} register={register} errors={errors} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.slice(2, 5).map((field) => (
          <FormField key={field.name} field={field} register={register} errors={errors} />
        ))}
      </div>

      <div className="divider" />
      <h3 className="section-label text-[10px]">SOCIAL LINKS</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.slice(5).map((field) => (
          <FormField key={field.name} field={field} register={register} errors={errors} />
        ))}
      </div>

      <div className="divider" />
      <h3 className="section-label text-[10px]">PROFESSIONAL SUMMARY</h3>
      <SectionTitleEditor sectionKey="summary" defaultTitle="Professional Summary" />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
          <span className="text-xs text-gray-400">
            {watch('summary')?.length || 0} chars
          </span>
        </div>

        <WYSIWYGEditor
          value={watch('summary') || ''}
          onChange={(val: string) => {
            setValue('summary', val);
            updateSection('personalInfo', { ...watch(), summary: val } as PersonalInfo);
          }}
          placeholder="Write a compelling professional summary that highlights your key achievements and value proposition..."
          minHeight="140px"
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">💡 Tip: 30–100 words works best for ATS</span>
        </div>
      </div>
    </div>
  );
}

function FormField({ field, register, errors }: {
  field: any;
  register: any;
  errors: any;
}) {
  const error = errors[field.name];
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {error && <span className="text-xs text-red-500 font-semibold">{error.message}</span>}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{field.icon}</span>
        <input
          {...register(field.name, field.validation || {})}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          className={`input pl-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
      </div>
    </div>
  );
}
