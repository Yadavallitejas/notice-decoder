import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader2, FileUp, ClipboardType } from 'lucide-react';
import toast from 'react-hot-toast';

import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

import mammoth from 'mammoth/mammoth.browser.js';

const SAMPLES = [
  {
    label: '📋 Property Tax Notice',
    text: `GREATER MUNICIPAL CORPORATION\nNOTICE OF DEMAND UNDER SECTION 213\n\nTo,\nThe Owner/Occupier,\nPlot 45, Sector 9.\n\nSubject: Payment of outstanding Property Tax.\n\nTake notice that a sum of Rs. 24,500/- is due from you on account of Property Tax for the year 2023-2024. You are hereby directed to pay the said amount within 15 days from the receipt of this notice. Failure to comply will result in a penalty of 2% per month and potential attachment of the property under Section 215 of the Municipal Act.`
  },
  {
    label: '⚡ Electricity Disconnection',
    text: `STATE ELECTRICITY BOARD\nDISCONNECTION NOTICE\n\nConsumer No: 98123746\nName: R. Sharma\n\nDear Consumer,\nYour electricity bill for the billing cycle ending March 2024 amounting to Rs. 4,320/- remains unpaid past the due date. Please be informed that if the outstanding dues are not cleared within 7 days of this notice, your power supply will be disconnected without any further intimation, and a reconnection fee of Rs. 500/- will be levied.`
  },
  {
    label: '🏦 Loan Recovery Notice',
    text: `NATIONAL BANK OF INDIA\nRECOVERY CELL\n\nNotice under Sec 13(2) of SARFAESI Act, 2002\n\nDear Customer (Loan A/c: 4455667788),\nDespite repeated reminders, you have failed to regularize your home loan account, which has been classified as a Non-Performing Asset (NPA). You are hereby called upon to discharge in full your liabilities amounting to Rs. 15,45,000/- within 60 days from the date of this notice. Failing this, the bank will exercise its rights under section 13(4) to take possession of the secured asset.`
  }
];

export default function DocumentUpload({ onAnalyze, isLoading }) {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setText(''); // Reset text while extracting

    if (uploadedFile.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
      };
      reader.readAsText(uploadedFile);
    } else if (uploadedFile.type === 'application/pdf') {
      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += content.items.map(item => item.str).join(' ') + '\n';
        }
        setText(extractedText);
        toast.success('PDF text extracted successfully.');
      } catch (error) {
        console.error("PDF Extraction error:", error);
        toast.error('Failed to extract text from PDF.');
      }
    } else if (
      uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      uploadedFile.name.endsWith('.docx')
    ) {
      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
        toast.success('Word document text extracted successfully.');
      } catch (error) {
        console.error("DOCX Extraction error:", error);
        toast.error('Failed to extract text from Word document.');
      }
    } else {
      toast.error('Unsupported file type.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = () => {
    if (!text.trim() && !file) {
      toast.error('Please paste some text or upload a document first.');
      return;
    }
    if (!text.trim() && file) {
      toast.error('File text is still extracting or is empty. Please wait.');
      return;
    }
    onAnalyze(text);
  };

  const handleSampleClick = (sampleText) => {
    setActiveTab('paste');
    setText(sampleText);
    setFile(null); // Clear any uploaded file when a sample is clicked
  };

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-12">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'paste' 
                ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-white' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <ClipboardType className="w-4 h-4" />
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'upload' 
                ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-white' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <FileUp className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white">
          
          {activeTab === 'paste' ? (
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the text of your government, legal, or bank notice here..."
                className="w-full h-64 p-4 text-[#1e293b] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none bg-[#f8fafc] placeholder-gray-400"
                disabled={isLoading}
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-[#f8fafc] px-1 rounded">
                {text.length} characters
              </div>
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className={`h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-[#f8fafc]'}`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex flex-col items-center text-[#1e3a5f]">
                  <FileText className="w-12 h-12 mb-3 text-[#1e3a5f]" />
                  <p className="text-sm font-medium mb-1 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                  <p className="text-xs text-[#f59e0b] mt-4">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <UploadCloud className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm sm:text-base font-medium text-[#1e293b] mb-1">
                    Drag & drop a file here, or click to select
                  </p>
                  <p className="text-xs sm:text-sm">Supports .TXT, .PDF, and .DOCX formats</p>
                </div>
              )}
            </div>
          )}

          {/* Sample Notices */}
          <div className="mt-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">
              Or try a sample notice:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample.text)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-blue-50 text-[#1e3a5f] border border-blue-100 rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors font-medium disabled:opacity-50"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!text.trim() && !file)}
            className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] hover:from-[#152e4d] hover:to-[#1d4ed8] text-white py-4 px-8 rounded-lg font-bold text-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Decoding Notice...
              </>
            ) : (
              <>
                Decode This Notice &rarr;
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-3">
            Your data is processed securely and is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
