import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ScanRecord } from '../types';

interface VoiceAssistanceProps {
  records: ScanRecord[];
  t: any;
}

const VoiceAssistance: React.FC<VoiceAssistanceProps> = ({ records, t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const handleSpeak = async (text: string) => {
    if (isPlaying || !text) return;
    setIsPlaying(true);
    try {
      const audioData = await geminiService.generateSpeech(text);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx({ sampleRate: 24000 });
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
        setIsPlaying(false);
        audioContext.close();
      };
      source.start();
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right duration-700">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{t.voice?.title || "Aural Archive"}</h2>
        <p className="text-teal-800 mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">{t.voice?.subtitle || "Neural Voice Synthesis"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="glass rounded-[2rem] md:rounded-[3rem] border border-slate-200 p-6 md:p-10 flex flex-col h-[520px] md:h-[700px]">
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-10 flex items-center space-x-4 uppercase tracking-widest">
            <span className="text-teal-700">📜</span>
            <span>{t.voice?.vault || "The Vault Collection"}</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {records.length === 0 && (
              <p className="text-slate-600 text-sm italic text-center py-10">No records yet. Upload or scan a document first.</p>
            )}
            {records.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRecord(r)}
                className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all border ${
                  selectedRecord?.id === r.id
                    ? 'bg-teal-700/10 border-teal-700/40'
                    : 'bg-white/70 border-slate-200 hover:border-teal-700/30'
                }`}
              >
                <div className="flex justify-between items-center mb-3 gap-2">
                  <span className="font-black text-[10px] uppercase tracking-widest text-teal-800">{r.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0">{new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed italic">"{r.originalText}"</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] md:rounded-[3rem] border border-teal-700/15 p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
          {selectedRecord ? (
            <div className="space-y-8 w-full animate-in zoom-in duration-500">
              <p className="text-sm text-slate-600 line-clamp-4 italic">"{selectedRecord.originalText}"</p>
              <button
                type="button"
                disabled={isPlaying}
                onClick={() => handleSpeak(selectedRecord.originalText)}
                className={`w-full py-5 md:py-6 rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center space-x-5 transition-all ${
                  isPlaying ? 'bg-slate-200 text-slate-500' : 'bg-teal-700 text-white hover:bg-teal-600'
                }`}
              >
                {isPlaying ? 'Playing...' : (t.voice?.commence || "Commence Playback")}
              </button>
            </div>
          ) : (
            <div className="text-slate-600 text-sm">Select a record to play...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistance;
