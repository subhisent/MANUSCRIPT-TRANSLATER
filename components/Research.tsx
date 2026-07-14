import React from 'react';

interface ResearchProps {
  t: any;
}

const Research: React.FC<ResearchProps> = ({ t }) => {
  const papers = [
    {
      title: t.research?.papers?.modi || "Historical Handwritten Modi Script Classification",
      authors: "Archaeological Data Science Team",
      link: "https://www.kaggle.com/datasets/msd6013/modi-hdc-historical-handwritten-modi-script",
      tags: ["Modi Script", "Marathi History", "Digitization"],
      desc: "Comprehensive dataset for recognizing and classifying the ancient Modi script used for administrative records in historical India.",
      color: "bg-teal-700/10 text-teal-800"
    },
    {
      title: t.research?.papers?.lang || "Manuscript Language & Script Recognition",
      authors: "Global Manuscript Research Group",
      link: "https://www.kaggle.com/datasets/adityamukati/manuscripts-language-classification",
      tags: ["Language Detection", "Scripts", "CNN"],
      desc: "A benchmarking dataset for multi-language identification from diverse manuscript snippets, facilitating global archival research.",
      color: "bg-sky-700/10 text-sky-800"
    },
    {
      title: t.research?.papers?.palm || "Deciphering Ancient Palm Leaf Manuscripts",
      authors: "ChronicleAI internal paper",
      link: "#",
      tags: ["OCR", "Palm Leaf", "Edge Detection"],
      desc: "An internal whitepaper on utilizing Gemini Vision models for segmenting overlapping characters in damaged palm leaf scrolls.",
      color: "bg-indigo-700/10 text-indigo-800"
    }
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in slide-in-from-right duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{t.research?.title || "Research Archive"}</h2>
          <p className="text-teal-800 mt-2 font-medium text-sm">{t.research?.subtitle || "Expert resources for historical script decipherment."}</p>
        </div>
        <div className="flex space-x-3">
          <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-2 border border-slate-200">
            <span className="w-3 h-3 bg-teal-700 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700">{t.research?.live || "Live Database"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {papers.map((paper, i) => (
          <div key={i} className="glass p-6 md:p-8 rounded-[2.5rem] card-3d border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {paper.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${paper.color}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">{paper.title}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed italic">"{paper.desc}"</p>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.993 7.993 0 002 12a7.993 7.993 0 007 7.196V4.804z" />
                    <path fillRule="evenodd" d="M11 4.804v14.392A7.993 7.993 0 0018 12a7.993 7.993 0 00-7-7.196z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{paper.authors}</p>
                  <p className="text-[10px] text-slate-500">Research Division</p>
                </div>
              </div>
            </div>
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-50 hover:bg-teal-700/10 border border-slate-200 py-4 rounded-2xl text-center font-bold text-sm text-teal-800 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Access Dataset Repository</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      <div className="glass p-8 md:p-12 rounded-[3rem] border border-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-700/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="max-w-2xl relative z-10">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">The Modi Script Initiative</h3>
          <p className="text-slate-600 leading-relaxed mb-8">
            Modi script was historically used to write Marathi. It emerged around the 12th century and was widely used during the Maratha Empire. Our tool utilizes trained classifications from the Kaggle Modi-HDC dataset to improve recognition of cursive handwritten characters found in thousands of administrative scrolls.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-0 sm:gap-4">
            <button type="button" className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-teal-900/20 active:scale-95">
              View Reference Guide
            </button>
            <button type="button" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-8 py-4 rounded-2xl border border-slate-200 transition-all">
              Contact Archivists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
