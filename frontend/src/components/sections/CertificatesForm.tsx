// Certificates Form
import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { newCertificate } from '../../utils/defaults';
import { Plus, Trash2, Award } from 'lucide-react';
import type { Certificate } from '../../types';
import { SectionTitleEditor } from '../builder/SectionTitleEditor';

export function CertificatesForm() {
  const { currentResume, updateSection } = useResumeStore();
  const certs = currentResume?.sections.certificates || [];
  const update = (updated: Certificate[]) => updateSection('certificates', updated);
  const add = () => update([...certs, newCertificate()]);
  const remove = (id: string) => update(certs.filter((c) => c.id !== id));
  const updateCert = (id: string, field: keyof Certificate, value: string) => {
    update(certs.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="space-y-4">
      <SectionTitleEditor sectionKey="certificates" defaultTitle="Certifications" />
      <div className="flex justify-end">
        <button onClick={add} className="btn btn-primary btn-sm gap-1.5"><Plus size={14} /> Add Certificate</button>
      </div>
      {certs.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-surface-700 rounded-2xl">
          <Award size={32} className="text-gray-300 mx-auto mb-3" />
          <div className="text-sm text-gray-500 mb-4">Add certifications to stand out</div>
          <button onClick={add} className="btn btn-primary btn-sm"><Plus size={14} /> Add Certificate</button>
        </div>
      )}
      {certs.map((cert) => (
        <div key={cert.id} className="card border border-gray-100 dark:border-surface-700 p-4 space-y-3">
          <div className="flex justify-end">
            <button onClick={() => remove(cert.id)} className="btn btn-ghost p-1.5 text-red-400"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Certificate Name *</label>
              <input className="input" value={cert.name} onChange={(e) => updateCert(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Issuing Organization</label>
              <input className="input" value={cert.issuer} onChange={(e) => updateCert(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Issue Date</label>
              <input className="input" type="month" value={cert.date} onChange={(e) => updateCert(cert.id, 'date', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Credential URL</label>
              <input className="input" value={cert.url} onChange={(e) => updateCert(cert.id, 'url', e.target.value)} placeholder="https://credly.com/..." />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
