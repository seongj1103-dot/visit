import heroPuppyImg from '../assets/images/puppy_guestbook_mascot_1790833971556.jpg';
import { playPuppyWoof } from '../utils/audio';
import { Sparkles, ArrowDown, BookOpen, Database, Heart } from 'lucide-react';

interface HeroBannerProps {
  totalMessages: number;
  totalPaws: number;
  isConnected: boolean;
  onOpenGuide: () => void;
  onScrollToWrite: () => void;
}

export function HeroBanner({
  totalMessages,
  totalPaws,
  isConnected,
  onOpenGuide,
  onScrollToWrite
}: HeroBannerProps) {
  const handlePuppyClick = () => {
    playPuppyWoof();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-amber-100/50 via-amber-50/30 to-transparent">
      {/* Decorative paw marks in background */}
      <div className="absolute top-10 left-10 text-amber-200/40 select-none text-4xl pointer-events-none rotate-12">🐾</div>
      <div className="absolute top-28 right-12 text-amber-200/40 select-none text-5xl pointer-events-none -rotate-12">🐾</div>
      <div className="absolute bottom-6 left-1/3 text-amber-200/30 select-none text-3xl pointer-events-none rotate-45">🐾</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Zone */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean unboxed metadata kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-800">
              <span>Google Sheets Database</span>
              <span aria-hidden="true">·</span>
              <span>Apps Script JSON API</span>
              <span aria-hidden="true">·</span>
              <span>실시간 방명록</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.2] font-gaegu">
              구글 시트로 만드는 <br className="hidden sm:inline" />
              세상에서 제일 귀여운 <span className="text-amber-700 underline decoration-amber-300 decoration-wavy decoration-2">멍멍 방명록</span>
            </h1>

            {/* Natural description */}
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              별도의 유료 데이터베이스나 복잡한 백엔드 서버 없이, 나만의 <strong className="font-semibold text-slate-800">구글 스프레드시트</strong>에 
              방문자의 따뜻한 응원 글을 즉시 저장하고 불러옵니다. 강아지 캐릭터와 발도장으로 하루의 피로를 사르르 녹여보세요!
            </p>

            {/* Status indicator bar (Clean, non-pill) */}
            <div className="flex items-center gap-3 py-2 px-3.5 bg-white/80 border border-amber-200/60 rounded-xl text-xs text-slate-700 max-w-md">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="font-medium text-slate-800">
                  {isConnected ? '내 구글 시트 연동 완료' : '현재 데모 모드 (즉시 체험 가능)'}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <button 
                onClick={onOpenGuide}
                className="text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer"
              >
                {isConnected ? '시트 설정 변경' : '3분만에 내 시트 연결하기'}
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToWrite}
                className="px-5 py-3 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-md shadow-amber-800/20 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>응원 한마디 남기기</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenGuide}
                className="px-5 py-3 text-sm font-semibold text-amber-950 bg-white hover:bg-amber-50/80 border border-amber-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Apps Script 코드 & 가이드</span>
              </button>
            </div>

            {/* Metric proof items (tabular numerals) */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-200/60 max-w-md">
              <div>
                <div className="text-2xl font-bold text-slate-900 font-gaegu tabular-nums">{totalMessages}</div>
                <div className="text-xs text-slate-500 mt-0.5">남겨진 응원글</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-800 font-gaegu tabular-nums">{totalPaws}</div>
                <div className="text-xs text-slate-500 mt-0.5">모인 발도장 🐾</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 font-gaegu tabular-nums">100%</div>
                <div className="text-xs text-slate-500 mt-0.5">무료 Google DB</div>
              </div>
            </div>

          </div>

          {/* Right Mascot Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Soft decorative shadow backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500"></div>

              {/* Main Card Container */}
              <div className="relative bg-white rounded-2xl p-3 border border-amber-100 shadow-xl overflow-hidden">
                <div className="relative overflow-hidden rounded-xl bg-amber-50 aspect-[16/10]">
                  <img
                    src={heroPuppyImg}
                    alt="귀여운 강아지 방명록 마스코트"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={handlePuppyClick}
                    title="멍멍이를 클릭하면 귀엽게 짖어요!"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 shadow-sm flex items-center gap-1.5 cursor-pointer" onClick={handlePuppyClick}>
                    <span>클릭하면 멍멍!</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                </div>

                <div className="p-3 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    "오늘도 방문해 주셔서 감사해요! 따뜻한 말 한마디 적고 가세요 멍!"
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
