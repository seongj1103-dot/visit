import { useState } from 'react';
import { DogBreed } from '../types';
import { DOG_BREEDS } from '../constants/dogs';
import { Send, Dice5, Loader2, Sparkles } from 'lucide-react';
import { playPuppyWoof } from '../utils/audio';

interface MessageFormProps {
  onSubmit: (name: string, message: string, dogBreed: DogBreed) => Promise<boolean>;
  isSubmitting: boolean;
  isConnected: boolean;
}

const RANDOM_NICKNAMES = [
  '행복한 리트리버',
  '우다다 웰시코기',
  '새침한 말티즈',
  '볼살통통 시바',
  '몽글몽글 푸들',
  '호기심 비글',
  '간식 탐정 댕댕이',
  '산책 요정',
  '식빵 굽는 강아지',
  '햇살 머금은 꼬리',
  '발바닥 젤리'
];

export function MessageForm({ onSubmit, isSubmitting, isConnected }: MessageFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<DogBreed>('retriever');
  const [validationError, setValidationError] = useState('');

  const handleRandomNickname = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    setName(RANDOM_NICKNAMES[randomIndex]);
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setValidationError('응원 한마디를 적어주세요! 🐾');
      return;
    }

    const finalName = name.trim() || '익명의 댕댕이';
    const success = await onSubmit(finalName, message.trim(), selectedBreed);
    if (success) {
      playPuppyWoof();
      setMessage('');
      setValidationError('');
    }
  };

  const breedList = Object.values(DOG_BREEDS);
  const activeBreed = DOG_BREEDS[selectedBreed];

  return (
    <section id="write-section" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md shadow-amber-900/5 p-6 sm:p-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-amber-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-gaegu flex items-center gap-2">
              <span>응원 한마디 남기기</span>
              <span className="text-xl">🐾</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isConnected 
                ? '등록 즉시 구글 스프레드시트에 행으로 안전하게 저장됩니다.'
                : '체험 모드에서 바로 작성해볼 수 있습니다. (시트 연동 시 구글 시트에 저장)'}
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium">
            <span>선택된 캐릭터:</span>
            <span className="font-semibold">{activeBreed.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dog Breed Selection Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              나를 표현할 강아지 친구 선택
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {breedList.map((breed) => {
                const isSelected = selectedBreed === breed.id;
                return (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => setSelectedBreed(breed.id)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer relative group flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-700/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 mb-1.5 border border-amber-200/60 shrink-0">
                      <img
                        src={breed.avatarUrl}
                        alt={breed.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {breed.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {breed.emoji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Input with Random Nickname Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="guest-name" className="text-xs font-semibold text-slate-700">
                작성자 닉네임
              </label>
              <button
                type="button"
                onClick={handleRandomNickname}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>랜덤 닉네임 뽑기</span>
              </button>
            </div>
            <input
              id="guest-name"
              type="text"
              maxLength={20}
              placeholder="예: 행복한 리트리버 (미입력 시 '익명의 댕댕이')"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError('');
              }}
              className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="guest-message" className="text-xs font-semibold text-slate-700">
                응원 한마디 <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {message.length} / 300자
              </span>
            </div>
            <textarea
              id="guest-message"
              rows={3}
              maxLength={300}
              placeholder="오늘 하루도 수고 많으셨어요! 강아지처럼 밝고 씩씩하게 파이팅 멍멍! 🐾"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (validationError) setValidationError('');
              }}
              className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all resize-none"
            />
            {validationError && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{validationError}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>따뜻하고 긍정적인 응원의 말을 나눠주세요.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 text-white font-semibold rounded-xl shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>스프레드시트에 저장 중...</span>
                </>
              ) : (
                <>
                  <span>응원 등록하기</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </section>
  );
}
