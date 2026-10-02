import { useState } from 'react';
import { GuestbookMessage } from '../types';
import { DOG_BREEDS } from '../constants/dogs';
import { playPawTap } from '../utils/audio';
import { Copy, Check } from 'lucide-react';

interface MessageCardProps {
  item: GuestbookMessage;
  onPawClick: (id: string | number) => void;
}

export function MessageCard({ item, onPawClick }: MessageCardProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const [isAnimatingPaw, setIsAnimatingPaw] = useState(false);
  const breedInfo = DOG_BREEDS[item.dogBreed] || DOG_BREEDS.retriever;

  const handlePaw = () => {
    playPawTap();
    setIsAnimatingPaw(true);
    setTimeout(() => setIsAnimatingPaw(false), 500);
    onPawClick(item.id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${item.name}: "${item.message}"`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <article className="group bg-white rounded-2xl border border-amber-200/70 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between relative overflow-hidden">
      
      {/* Top zone: Author profile and clean metadata */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-amber-50 border border-amber-200/60 shrink-0">
              <img
                src={breedInfo.avatarUrl}
                alt={breedInfo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">
                {item.name}
              </h3>
              
              {/* Zero-Pill unboxed metadata */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span>{breedInfo.name}</span>
                <span aria-hidden="true">·</span>
                <time className="tabular-nums">{item.timestamp || '방금 전'}</time>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="응원글 복사하기"
            aria-label="응원글 복사"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Message body */}
        <p className="text-sm text-slate-700 leading-relaxed break-words whitespace-pre-line py-1">
          {item.message}
        </p>
      </div>

      {/* Bottom zone: Interactive Paw Stamp */}
      <div className="pt-4 mt-3 border-t border-amber-100/70 flex items-center justify-between">
        <span className="text-[11px] text-amber-800/80 font-medium">
          {breedInfo.tagline}
        </span>

        <button
          type="button"
          onClick={handlePaw}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            item.paws > 0
              ? 'bg-amber-100/70 text-amber-900 hover:bg-amber-100'
              : 'bg-slate-100/80 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
          } ${isAnimatingPaw ? 'scale-110' : 'scale-100'}`}
        >
          <span className={`text-sm inline-block ${isAnimatingPaw ? 'animate-bounce' : ''}`}>
            🐾
          </span>
          <span className="tabular-nums font-bold">{item.paws}</span>
          <span className="text-[10px] text-slate-500 font-normal">발도장</span>
        </button>
      </div>

    </article>
  );
}
