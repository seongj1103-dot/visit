import { Volume2, VolumeX, Settings, Database, Sparkles } from 'lucide-react';

interface NavbarProps {
  isConnected: boolean;
  gasUrl: string;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onScrollToSection: (id: string) => void;
}

export function Navbar({
  isConnected,
  isMuted,
  onToggleSound,
  onOpenSettings,
  onScrollToSection
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-bold tracking-tight text-amber-950 font-gaegu flex items-center gap-2 group"
        >
          <span className="text-2xl transition-transform group-hover:scale-110">🐾</span>
          <span className="text-2xl">멍멍 방명록</span>
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onScrollToSection('write-section')} 
            className="hover:text-amber-900 transition-colors cursor-pointer"
          >
            응원 남기기
          </button>
          <button 
            onClick={() => onScrollToSection('list-section')} 
            className="hover:text-amber-900 transition-colors cursor-pointer"
          >
            방명록 목록
          </button>
          <button 
            onClick={onOpenSettings} 
            className="hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>시트 연동 가이드</span>
            <span className="text-[11px] text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded font-medium">초보자용</span>
          </button>
          <button 
            onClick={() => onScrollToSection('dogs-section')} 
            className="hover:text-amber-900 transition-colors cursor-pointer"
          >
            강아지 친구들
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-500 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? '소리 켜기 (멍멍 효과음)' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-amber-700" />}
          </button>

          <button
            onClick={onOpenSettings}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
              isConnected
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-amber-900 text-white hover:bg-amber-950 shadow-amber-900/15'
            }`}
          >
            {isConnected ? (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>시트 연결됨</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span>구글 시트 연동</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
