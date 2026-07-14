import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { ScanRecord } from '../types';

interface UploadProps {
  onSave: (record: ScanRecord) => void;
  t: any;
}

const LANGUAGES = [
  'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'English'
];

const Upload: React.FC<UploadProps> = ({ onSave, t }) => {
  const CATEGORIES = [
    { id: 'land_doc', label: t.upload?.categories?.land_doc || 'Land Records (Patta)', icon: '📜' },
    { id: 'property_record', label: t.upload?.categories?.property_record || 'Property Ownership', icon: '🏡' },
    { id: 'village_account', label: t.upload?.categories?.village_account || 'Village Account', icon: '🏘️' },
    { id: 'tax_record', label: t.upload?.categories?.tax_record || 'Tax & Revenue', icon: '💰' },
    { id: 'genealogy', label: t.upload?.categories?.genealogy || 'Family Genealogy', icon: '🌳' },
    { id: 'palm_leaf', label: t.upload?.categories?.palm_leaf || 'Palm Leaf Manuscript', icon: '🌿' },
    { id: 'sculpture', label: t.upload?.categories?.sculpture || 'Sculpture Inscription', icon: '🗿' },
    { id: 'copper_plate', label: t.upload?.categories?.copper_plate || 'Copper Plate Scroll', icon: '📀' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCategory) return;

    setIsProcessing(true);
    setResultData(null);
    setTranslatedText('');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageUrl(reader.result as string);

      try {
        const data = await geminiService.performOCR(base64, selectedCategory);
        setResultData(data);

        const newRecord: ScanRecord = {
          id: `DOC-${Math.floor(Math.random() * 10000)}`,
          type: selectedCategory,
          timestamp: new Date().toISOString(),
          originalText: data.extractedText,
          language: data.detectedLanguage,
          imageUrl: reader.result as string
        };
        onSave(newRecord);
      } catch (error) {
        console.error("OCR failed", error);
        alert("Processing failed. Please try again or check your API key.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTranslate = async (lang: string) => {
    if (!resultData?.extractedText || !lang) return;
    setIsTranslating(true);
    try {
      const translated = await geminiService.translateText(resultData.extractedText, lang);
      setTranslatedText(translated);
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReadAloud = async () => {
    const textToRead = translatedText || resultData?.extractedText;
    if (!textToRead || isReading) return;
    setIsReading(true);
    try {
      const audioData = await geminiService.generateSpeech(textToRead);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        setIsReading(false);
        audioContext.close();
      };
      source.start();
    } catch (err) {
      console.error("TTS Error:", err);
      setIsReading(false);
    }
  };

  const downloadReport = () => {
    const content = `ChronicleAI Heritage Report\nDate: ${new Date().toLocaleString()}\n\nEXTRACTED TEXT:\n${resultData?.extractedText}\n\nLANGUAGE:\n${resultData?.detectedLanguage}\n\nNOTES:\n${resultData?.preservationNotes}\n\nTRANSLATED:\n${translatedText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heritage-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 md:space-y-12 animate-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{t.upload?.title || "Heritage Digitization"}</h2>
        <p className="text-teal-800 font-semibold uppercase tracking-[0.15em] text-xs max-w-2xl mx-auto leading-relaxed">
          {t.upload?.description || "Upload old heritage manuscripts, land records, or scriptures. Our AI will digitize and translate them into modern languages."}
        </p>
        <div className="w-24 h-1 bg-teal-700 mx-auto rounded-full opacity-70"></div>
      </div>

      {!resultData && !isProcessing ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] glass transition-all border-2 flex flex-col items-center justify-center card-3d shadow-lg ${
                selectedCategory === cat.id
                  ? 'border-teal-700 bg-teal-700/10 scale-[1.02] shadow-teal-900/10'
                  : 'border-slate-200 hover:border-teal-700/40'
              }`}
            >
              <span className="text-3xl md:text-5xl block mb-3 md:mb-6">{cat.icon}</span>
              <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-widest text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      {selectedCategory && !resultData && !isProcessing && (
        <div className="flex justify-center mt-8 md:mt-12 animate-in zoom-in duration-500">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex items-center space-x-4 bg-teal-700 hover:bg-teal-600 text-white px-8 md:px-16 py-5 md:py-6 rounded-[2rem] font-black text-base md:text-xl shadow-xl shadow-teal-900/30 transition-all active:scale-95 border-2 border-teal-600/40 uppercase tracking-[0.1em]"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{t.upload?.inject || "Inject Source Scroll"}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}

      {isProcessing && (
        <div className="glass p-16 md:p-24 rounded-[3rem] text-center border border-teal-700/20 animate-pulse relative overflow-hidden">
          <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-8 relative z-10"></div>
          <h3 className="text-2xl md:text-3xl font-black text-teal-800 tracking-widest uppercase relative z-10">Initializing Neural Array...</h3>
        </div>
      )}

      {resultData && (
        <div className="space-y-8 md:space-y-10 animate-in fade-in duration-1000">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-teal-700/15">
              <h4 className="text-teal-800 font-black text-[10px] uppercase tracking-[0.4em] mb-4">{t.upload?.scriptInfo || "Script Intelligence"}</h4>
              <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{resultData.detectedLanguage}</p>
            </div>
            <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-slate-200">
              <h4 className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">{t.upload?.notes || "Preservation Notes"}</h4>
              <p className="text-slate-700 italic text-sm leading-relaxed">{resultData.preservationNotes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="glass rounded-[2rem] md:rounded-[3rem] border border-slate-200 overflow-hidden flex flex-col h-full card-3d shadow-xl">
              <div className="bg-slate-50 px-6 md:px-10 py-5 border-b border-slate-200 flex justify-between items-center gap-3">
                <span className="font-black text-teal-800 uppercase tracking-[0.2em] text-[10px]">{t.upload?.transcript || "Neural Recognition Matrix"}</span>
                <button
                  type="button"
                  onClick={() => { setResultData(null); setSelectedCategory(null); }}
                  className="text-slate-600 hover:text-teal-800 transition-colors text-xs font-black uppercase tracking-widest shrink-0"
                >
                  {t.upload?.flush || "Flush System"}
                </button>
              </div>
              <div className="p-6 md:p-10 flex-1 bg-slate-100 font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap overflow-y-auto max-h-[550px] custom-scrollbar">
                {resultData.extractedText}
              </div>
            </div>

            <div className="flex flex-col space-y-6 md:space-y-8">
              <div className="glass rounded-[2rem] md:rounded-[3rem] border border-teal-700/15 overflow-hidden flex flex-col h-full card-3d shadow-xl">
                <div className="bg-teal-700/5 px-6 md:px-10 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className="font-black text-teal-800 uppercase tracking-[0.2em] text-[10px]">{t.upload?.mapping || "Modern Translation"}</span>
                  <select
                    onChange={(e) => handleTranslate(e.target.value)}
                    className="bg-white border border-teal-700/30 text-xs rounded-xl px-4 py-2 outline-none text-teal-800 font-black uppercase tracking-widest focus:ring-2 focus:ring-teal-700/30"
                    defaultValue=""
                  >
                    <option value="">{t.upload?.target || "Script Target"}</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="p-6 md:p-10 flex-1 bg-teal-700/5 text-lg md:text-xl leading-relaxed min-h-[280px] md:min-h-[400px] overflow-y-auto text-slate-800 font-serif italic custom-scrollbar">
                  {isTranslating ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-teal-800">
                      <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
                      <span className="uppercase tracking-widest text-xs font-black">Mapping Neural Nets...</span>
                    </div>
                  ) : translatedText || <span className="text-slate-500 italic text-base font-sans not-italic">Translation result will appear here after target selection...</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <button
                  type="button"
                  onClick={handleReadAloud}
                  disabled={isReading}
                  className={`flex items-center justify-center space-x-3 py-5 md:py-6 rounded-[2rem] font-black transition-all border-2 uppercase tracking-[0.15em] text-xs ${
                    isReading
                      ? 'bg-teal-700/5 text-teal-700/50 border-teal-700/10'
                      : 'bg-teal-700/10 text-teal-800 hover:bg-teal-700/15 border-teal-700/30 active:scale-95'
                  }`}
                >
                  <svg className={`w-6 h-6 ${isReading ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>{isReading ? 'Synthesizing...' : (t.upload?.read || "Aural Output")}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadReport}
                  className="bg-teal-700 hover:bg-teal-600 text-white font-black py-5 md:py-6 rounded-[2rem] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl border border-teal-600/40 uppercase tracking-[0.15em] text-xs"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t.upload?.log || "Log Report"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
