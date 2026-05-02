import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, AlertTriangle, Info, CheckCircle,
  FileText, Calendar, Target, Copy, RotateCcw, 
  Save, Languages, ChevronDown, ChevronUp, ShieldCheck,
  HelpCircle, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { saveAnalysis } from '../services/firebaseConfig';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
];

const KeyTerm = ({ term }) => {
  const [isOpen, setIsOpen] = useState(false);
  const parts = term.split(':');
  const termName = parts[0];
  const explanation = parts.slice(1).join(':').trim();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[#1e3a5f] text-sm text-left">{termName}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-3 pt-1 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
          {explanation || term}
        </div>
      )}
    </div>
  );
};

export default function ResultPanel({ result, inputText, onReset, hideActions = false }) {
  const { user } = useAuth();
  const [targetLang, setTargetLang] = useState('en');
  const [displayResult, setDisplayResult] = useState(result);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Reset state if result changes
    setTargetLang('en');
    setDisplayResult(result);
  }, [result]);

  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    setTargetLang(lang);
    
    if (lang === 'en') {
      setDisplayResult(result);
      return;
    }

    setIsTranslating(true);
    try {
      const stringsToTranslate = [
        result.title || ' ',
        result.summary || ' ',
        result.what_it_means || ' ',
        result.action_required || ' ',
        result.deadline || ' ',
        result.dont_panic_message || ' '
      ];
      
      const keyTermsCount = result.key_terms ? result.key_terms.length : 0;
      if (keyTermsCount > 0) {
        stringsToTranslate.push(...result.key_terms);
      }

      const delimiter = '\n~|~\n';
      const textToTranslate = stringsToTranslate.join(delimiter);

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `q=${encodeURIComponent(textToTranslate)}`
      });
      
      const data = await res.json();
      let translatedText = '';
      data[0].forEach(item => {
        if (item[0]) translatedText += item[0];
      });

      const translatedArray = translatedText.split(/\n?~\|~\n?/);

      const newResult = {
        ...result,
        title: translatedArray[0]?.trim() || result.title,
        summary: translatedArray[1]?.trim() || result.summary,
        what_it_means: translatedArray[2]?.trim() || result.what_it_means,
        action_required: translatedArray[3]?.trim() || result.action_required,
        deadline: translatedArray[4]?.trim() || result.deadline,
        dont_panic_message: translatedArray[5]?.trim() || result.dont_panic_message,
      };

      if (keyTermsCount > 0) {
        newResult.key_terms = translatedArray.slice(6, 6 + keyTermsCount).map(t => t?.trim() || '');
      }

      setDisplayResult(newResult);
    } catch (error) {
      console.error("Translation error", error);
      toast.error("Failed to translate text.");
      setTargetLang('en');
      setDisplayResult(result);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Title: ${result.title}\n\nSummary:\n${result.summary}\n\nWhat This Means:\n${result.what_it_means}\n\nAction Required:\n${result.action_required}\n\nDeadline:\n${result.deadline || 'None'}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success("Summary copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text."));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save notices.");
      return;
    }
    
    setIsSaving(true);
    try {
      await saveAnalysis(user.uid, inputText, result);
      toast.success("Saved to your history ✅");
    } catch (error) {
      console.error("Error saving document: ", error);
      toast.error("Failed to save to history.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!displayResult) return null;

  // Determine urgency theme
  let urgencyTheme = {
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: <CheckCircle className="w-5 h-5 mr-2" />,
    label: '✅ No Immediate Action'
  };

  if (displayResult.urgency_level === 'CRITICAL') {
    urgencyTheme = {
      bg: 'bg-red-100',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertOctagon className="w-5 h-5 mr-2" />,
      label: '🚨 Urgent Action Required'
    };
  } else if (displayResult.urgency_level === 'HIGH') {
    urgencyTheme = {
      bg: 'bg-orange-100',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: <AlertTriangle className="w-5 h-5 mr-2" />,
      label: '⚠️ Action Needed'
    };
  } else if (displayResult.urgency_level === 'MEDIUM') {
    urgencyTheme = {
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <Info className="w-5 h-5 mr-2" />,
      label: '📋 Review Required'
    };
  }

  return (
    <div className={hideActions ? "w-full" : "w-full max-w-4xl mx-auto mt-6 mb-16 opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]"}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      
      {/* Main Card */}
      <div className={`bg-white overflow-hidden ${hideActions ? '' : 'rounded-2xl shadow-xl border border-gray-100'}`}>
        
        {/* Urgency Banner */}
        <div className={`w-full px-6 py-3 border-b flex items-center font-bold text-sm sm:text-base ${urgencyTheme.bg} ${urgencyTheme.border} ${urgencyTheme.text}`}>
          {urgencyTheme.icon}
          {urgencyTheme.label}
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#1e3a5f] mb-4">
              {displayResult.title}
            </h2>
            
            {/* Translation & Summary */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Languages className="w-4 h-4 text-gray-500" />
                <select 
                  value={targetLang}
                  onChange={handleLanguageChange}
                  className="bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer border-b border-dashed border-gray-400 pb-0.5"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-3 mt-1 pr-32 sm:pr-40">
                <FileText className="w-6 h-6 text-[#1e3a5f] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Plain English Summary</h3>
                  {isTranslating ? (
                    <p className="text-sm text-gray-500 mt-2 italic animate-pulse">Translating document...</p>
                  ) : (
                    <p className="text-[#1e293b] text-lg leading-relaxed">
                      {displayResult.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" />
                <h4 className="font-bold text-[#1e3a5f]">What This Means</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{isTranslating ? '...' : displayResult.what_it_means}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold text-[#1e3a5f]">What You Should Do</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{isTranslating ? '...' : displayResult.action_required}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-red-500" />
                <h4 className="font-bold text-[#1e3a5f]">Deadline</h4>
              </div>
              <p className="text-gray-700 text-sm font-semibold">{isTranslating ? '...' : (displayResult.deadline || 'No deadline mentioned')}</p>
            </div>
          </div>

          {/* Key Terms */}
          {displayResult.key_terms && displayResult.key_terms.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Confusing Terms Explained
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isTranslating ? (
                   <div className="text-sm text-gray-500 italic">Translating terms...</div>
                ) : (
                  displayResult.key_terms.map((term, idx) => (
                    <KeyTerm key={idx} term={term} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Don't Panic Message */}
          {displayResult.is_this_serious && displayResult.dont_panic_message && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4 shadow-inner mt-4">
              <ShieldCheck className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-bold mb-1">Don't Panic!</h4>
                <p className="text-blue-900 text-sm">{isTranslating ? '...' : displayResult.dont_panic_message}</p>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        {!hideActions && (
        <div className="bg-gray-50 p-4 sm:px-8 border-t border-gray-100 flex flex-wrap gap-3 justify-end items-center">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy Summary
          </button>
          
          <button 
            onClick={async () => {
              const textToShare = `I just decoded a "${displayResult.title}" using NoticeDecoder! Check it out: ${window.location.origin}`;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'NoticeDecoder',
                    text: textToShare,
                    url: window.location.origin,
                  });
                } catch (error) {
                  if (error.name !== 'AbortError') console.error("Error sharing", error);
                }
              } else {
                navigator.clipboard.writeText(textToShare)
                  .then(() => toast.success("Link copied to share!"))
                  .catch(() => toast.error("Failed to copy link."));
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          {user && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save to History'}
            </button>
          )}

          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-2 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#152e4d] transition-colors shadow-sm text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Decode Another
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
