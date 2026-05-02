import React, { useState, useRef, useEffect } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import ResultPanel from '../components/ResultPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeDocument } from '../services/geminiService';
import toast from 'react-hot-toast';
import { 
  FileText, Bot, CheckCircle2, Shield, Zap, Flag 
} from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputText, setInputText] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    if ((result || isLoading) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result, isLoading]);

  const handleAnalyze = async (text) => {
    setIsLoading(true);
    setResult(null);
    setInputText(text);
    
    try {
      const data = await analyzeDocument(text);
      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to decode document: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f0f4ff] to-[#ffffff] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a5f] tracking-tight mb-6">
            Confused by an official notice? <br className="hidden md:block" />
            <span className="text-blue-600">We'll decode it.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste any government, bank, or legal document — get a plain English explanation in seconds. 
            <span className="font-semibold text-gray-800"> Free. Private. For every Indian.</span>
          </p>
          
          <DocumentUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      </section>

      {/* Dynamic Results Area */}
      <div ref={resultRef} className="px-4 sm:px-6 lg:px-8 w-full flex-shrink-0 relative -mt-4 z-10">
        {isLoading && <LoadingSpinner />}
        {result && !isLoading && (
          <ResultPanel result={result} inputText={inputText} onReset={handleReset} />
        )}
      </div>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[2px] bg-blue-100 z-0"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Step 1</h3>
              <p className="text-gray-600 font-medium">Paste your notice</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Step 2</h3>
              <p className="text-gray-600 font-medium">AI decodes it instantly</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Step 3</h3>
              <p className="text-gray-600 font-medium">Understand & act confidently</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-[#1e3a5f] text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm md:text-base font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-300" />
            <span>Your documents are never stored</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Results in under 5 seconds</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-orange-400" />
            <span>Built for India</span>
          </div>
        </div>
      </section>

    </div>
  );
}
