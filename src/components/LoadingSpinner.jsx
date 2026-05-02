import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Reading the fine print...",
  "Decoding legal jargon...",
  "Translating bureaucratic language...",
  "Almost there..."
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-16 opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-pulse">
        
        {/* Banner Skeleton */}
        <div className="w-full h-12 bg-gray-200 border-b border-gray-200"></div>

        <div className="p-6 sm:p-8">
          
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-md w-2/3 mb-6"></div>
            
            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mt-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          {/* Cycling Status Text */}
          <div className="flex items-center justify-center gap-3 mt-12 mb-4 text-blue-600 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="animate-pulse">{MESSAGES[messageIndex]}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
