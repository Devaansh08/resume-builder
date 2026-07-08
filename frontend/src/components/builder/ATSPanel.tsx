import { useResumeStore } from '../../store/resumeStore';
import { getScoreColor, getScoreBg } from '../../utils/ats';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

const SEVERITY_ICONS = {
  error: <XCircle size={14} className="text-red-500 flex-shrink-0" />,
  warning: <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />,
  info: <Info size={14} className="text-blue-500 flex-shrink-0" />,
};

export function ATSPanel() {
  const { atsResult } = useResumeStore();

  if (!atsResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-gray-400 text-sm">Start filling your resume to see your ATS score</div>
      </div>
    );
  }

  const { score, checks, wordCount, actionVerbCount } = atsResult;
  const scoreColor = getScoreColor(score);
  const scoreBg = getScoreBg(score);
  const passed = checks.filter((c) => c.passed).length;

  return (
    <div className="p-4 space-y-5">
      {/* Score circle */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        <div className="text-center">
          <div className={`font-semibold ${scoreColor}`}>
            {score >= 80 ? '🎉 Excellent' : score >= 60 ? '⚡ Good' : '🔧 Needs Work'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {passed}/{checks.length} checks passed
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-gray-50 dark:bg-surface-800 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{wordCount}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
          <div className="bg-gray-50 dark:bg-surface-800 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{actionVerbCount}</div>
            <div className="text-xs text-gray-500">Action Verbs</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>ATS Score</span>
          <span className={scoreColor}>{score}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-surface-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${scoreBg}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Checks */}
      <div>
        <h4 className="section-label text-[10px] mb-3">DETAILED ANALYSIS</h4>
        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.id} className="bg-gray-50 dark:bg-surface-800 rounded-xl p-3">
              <div className="flex items-start gap-2">
                {check.passed
                  ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  : SEVERITY_ICONS[check.severity]
                }
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">{check.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{check.description}</div>
                  {check.suggestion && !check.passed && (
                    <div className="text-xs text-brand-600 dark:text-brand-400 mt-1.5 bg-brand-50 dark:bg-brand-950/50 p-2 rounded-lg">
                      💡 {check.suggestion}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
