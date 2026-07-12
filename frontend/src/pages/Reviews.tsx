import React from 'react';
import { Star, MessageSquareQuote, Sparkles, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/shared/PageHeader';
import { Footer } from '../components/layout/Footer';
import { useResumeStore } from '../store/resumeStore';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { createNewResume, setCurrentResume } = useResumeStore();

  const handleStartBlank = () => {
    const newResume = createNewResume('Untitled Resume', 'blank');
    setCurrentResume(newResume);
    navigate('/builder');
  };

  const handleCreateNew = () => {
    const newResume = createNewResume('Alex Rivera — Software Architect', 'software');
    setCurrentResume(newResume);
    navigate('/builder');
  };

  const REVIEWS = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer @ Microsoft',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Resume Alchemist completely transformed how I present my skills. The Indian Academic and Modern templates helped me clear ATS screeners at 4 tier-1 tech companies on my first attempt!',
      date: '2 weeks ago',
    },
    {
      name: 'Rohan Verma',
      role: 'Product Manager @ Flipkart',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'The fact that everything runs client-side inside local browser storage with zero sign-up required is amazing. Best resume builder on the web right now.',
      date: '1 month ago',
    },
    {
      name: 'Ananya Iyer',
      role: 'Data Scientist @ Google',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'I love how clickable links and project URLs carry over cleanly into the downloaded PDF. The clean typography and spacing options make my resume stand out immediately.',
      date: '3 weeks ago',
    },
    {
      name: 'David Chen',
      role: 'Senior Cloud Consultant',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Swapping between the 8 different templates without losing any bullet points or custom sections is a game changer. Super sleek UI and lightning-fast PDF export.',
      date: '1 month ago',
    },
    {
      name: 'Sneha Patel',
      role: 'HR & Talent Acquisition Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'As a recruiter reviewing hundreds of CVs daily, resumes created with Resume Alchemist immediately catch my eye due to their perfect visual balance and readability.',
      date: '5 days ago',
    },
    {
      name: 'Vikram Nair',
      role: 'Full-Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'No watermarks, no paywalls right before download, and zero server logging. Truly built by engineers who care about privacy and user experience.',
      date: '3 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-transparent flex flex-col justify-between">
      <PageHeader />

      <main className="flex-grow py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-20">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs">
            <MessageSquareQuote size={14} /> Community Reviews
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-surface-900 dark:text-white leading-tight">
            Loved by 12,000+ Engineers, Scholars & Leaders
          </h1>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-400">
            See how job seekers across the globe use Resume Alchemist to land tier-1 interviews with confidence.
          </p>

          <div className="flex items-center justify-center gap-6 pt-4 text-sm font-bold text-surface-800 dark:text-surface-200">
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span>4.9 / 5 Average Rating</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
              <span>100% Free & Unrestricted</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-surface-200/60 dark:border-surface-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-surface-300 dark:border-surface-700"
                />
                <div>
                  <div className="text-xs font-bold text-surface-900 dark:text-white">{rev.name}</div>
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-brand-500/10 via-amber-500/10 to-brand-500/10 border border-brand-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-surface-900 dark:text-white">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
            Join thousands of professionals landing their dream careers. Zero sign-up, full privacy, instant PDF export.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleCreateNew} className="btn btn-primary btn-lg gap-2 font-extrabold">
              <Sparkles size={16} /> Start with Demo Data
            </button>
            <button onClick={handleStartBlank} className="btn btn-outline btn-lg gap-2 font-bold">
              <PlusCircle size={16} /> Start Blank Resume
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
