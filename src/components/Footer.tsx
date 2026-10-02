import { Heart } from 'lucide-react';

interface FooterProps {
  onOpenGuide: () => void;
}

export function Footer({ onOpenGuide }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-amber-200/60 bg-amber-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <span className="text-base">🐾</span>
            <span className="font-bold text-slate-800 font-gaegu text-base">멍멍 방명록</span>
            <span>— 구글 스프레드시트 기반 응원 게시판</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenGuide}
              className="hover:text-amber-900 underline transition-colors cursor-pointer"
            >
              Apps Script 연동 가이드
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="https://sheets.new"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-900 underline transition-colors"
            >
              Google Sheets 바로가기
            </a>
          </div>

          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for puppy lovers</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
