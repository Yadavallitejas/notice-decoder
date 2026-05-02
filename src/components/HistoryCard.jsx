import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ResultPanel from './ResultPanel';

export default function HistoryCard({ scan, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { documentTitle, result, createdAt, inputText } = scan;

  // Format date safely
  const dateStr = createdAt?.toDate ? createdAt.toDate().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : 'Just now';

  // Urgency badge
  let badgeColor = 'bg-green-100 text-green-800 border-green-200';
  if (result.urgency_level === 'CRITICAL') badgeColor = 'bg-red-100 text-red-800 border-red-200';
  else if (result.urgency_level === 'HIGH') badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
  else if (result.urgency_level === 'MEDIUM') badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div 
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#1e3a5f] truncate max-w-full">{documentTitle}</h3>
            <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
              {result.urgency_level}
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate max-w-full">{result.summary}</p>
        </div>
        
        <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto">
          <span className="text-sm font-medium text-gray-400">{dateStr}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(scan.id); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete from history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="p-1 bg-gray-100 rounded-full text-gray-500 hidden sm:block">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-0 sm:p-4 bg-gray-50 border-t border-gray-200">
             <ResultPanel result={result} inputText={inputText} hideActions={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
