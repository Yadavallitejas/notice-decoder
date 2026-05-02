import React from 'react';
import { ShieldCheck, Code, BookOpen, AlertTriangle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e3a5f] tracking-tight mb-4">
          About NoticeDecoder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Empowering citizens to understand the fine print.
        </p>
      </div>

      <div className="space-y-12">
        {/* Why it was built */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-[#1e3a5f]">The Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            Government notices, legal documents, and banking letters are notoriously difficult to understand. 
            They are often filled with jargon, complex clauses, and intimidating threats. 
            NoticeDecoder was built to democratize this information. By translating bureaucratic language into 
            simple, actionable plain English, we ensure that every Indian citizen knows their rights and what they need to do next.
          </p>
        </section>

        {/* Hackathon Note */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
          <p className="text-[#1e3a5f] font-bold text-lg mb-2">
            🚀 Built at PromptWars Virtual
          </p>
          <p className="text-blue-800">
            A bi-weekly AI hackathon powered by Google & Hack2Skill.
          </p>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-[#1e3a5f]">How It Works</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            NoticeDecoder is a completely serverless web application powered by modern cloud infrastructure:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            <li><span className="font-semibold text-gray-900">Frontend:</span> React + Vite + Tailwind CSS</li>
            <li><span className="font-semibold text-gray-900">AI Core:</span> Google Gemini API (gemini-2.0-flash model)</li>
            <li><span className="font-semibold text-gray-900">Backend & Auth:</span> Firebase Authentication and Firestore</li>
            <li><span className="font-semibold text-gray-900">Translation:</span> Google Translate Free API</li>
          </ul>
        </section>

        {/* Privacy Policy */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Privacy First</h2>
          </div>
          <p className="text-gray-700 leading-relaxed font-medium">
            We never store your documents without your permission.
          </p>
          <p className="text-gray-600 mt-2">
            When you decode a notice, the text is sent securely to Google's Gemini API and then immediately discarded. 
            Nothing is ever saved to our database unless you explicitly click the "Save to History" button while logged into your account.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="bg-orange-50 rounded-2xl border border-orange-200 p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-orange-800 font-bold mb-1">Important Legal Disclaimer</h3>
            <p className="text-orange-900 text-sm leading-relaxed">
              This is an AI-powered tool designed to provide general summaries of complex documents. 
              It is not a substitute for professional legal advice. For critical legal, financial, or government matters, 
              <strong> always consult a qualified lawyer or relevant professional.</strong>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
