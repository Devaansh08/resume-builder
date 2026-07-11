import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { getScoreColor, getScoreBg } from '../../utils/ats';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

const SEVERITY_ICONS = {
  error: <XCircle size={14} className="text-red-500 flex-shrink-0" />,
  warning: <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />,
  info: <Info size={14} className="text-blue-500 flex-shrink-0" />,
};

export const ATSPanel = React.memo(function ATSPanel() {
  const atsResult = useResumeStore((state) => state.atsResult);

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

      {/* Checks & AI Recommendations */}
      <div>
        <h4 className="section-label text-[10px] mb-3 flex items-center justify-between">
          <span>AI ATS ANALYSIS & SENTENCE RECOMMENDATIONS</span>
        </h4>
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="bg-gray-50 dark:bg-surface-800/90 border border-gray-100 dark:border-surface-700 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                {check.passed
                  ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  : SEVERITY_ICONS[check.severity]
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{check.label}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      check.passed 
                        ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                        : check.severity === 'error'
                        ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                    }`}>
                      {check.passed ? 'PASSED' : check.severity === 'error' ? 'ACTION REQUIRED' : 'OPTIMIZE'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{check.description}</div>
                  
                  {check.rationale && (
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 italic mt-1.5 flex items-center gap-1.5">
                      <span>🔍</span> <span>{check.rationale}</span>
                    </div>
                  )}

                  {check.suggestion && !check.passed && (
                    <div className="text-xs font-medium text-brand-700 dark:text-brand-300 mt-2 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/50 p-2.5 rounded-lg leading-relaxed">
                      <span className="font-bold block mb-0.5">💡 AI Action Plan:</span>
                      {check.suggestion}
                    </div>
                  )}

                  {check.examples && check.examples.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-surface-700/60">
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Real-World Complete Sentences (Click to Copy)</span>
                      </div>
                      <div className="space-y-1.5">
                        {check.examples.map((example, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(example);
                            }}
                            className="w-full text-left text-xs bg-white dark:bg-surface-900 hover:bg-brand-50/70 dark:hover:bg-brand-950/40 border border-gray-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 p-2 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-150 group relative"
                            title="Click to copy this complete sentence to clipboard"
                          >
                            <span className="block pr-5 leading-relaxed">{example}</span>
                            <span className="absolute right-2 top-2 text-[10px] text-brand-500 opacity-0 group-hover:opacity-100 font-semibold">
                              Copy
                            </span>
                          </button>
                        ))}
                      </div>
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
});
