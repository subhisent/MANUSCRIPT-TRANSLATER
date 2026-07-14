import React from 'react';
import { DocType } from '../types';

interface DocumentCardProps {
  type: DocType;
  isSelected: boolean;
  onClick: () => void;
  image: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ type, isSelected, onClick, image }) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isSelected ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
          isSelected
            ? 'border-primary shadow-[0_0_30px_rgba(15,118,110,0.25)]'
            : 'border-slate-200'
        } bg-white`}
      >
        <div className="h-48 w-full overflow-hidden">
          <img src={image} alt={String(type)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="p-4 text-center">
          <h3 className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{type}</h3>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
