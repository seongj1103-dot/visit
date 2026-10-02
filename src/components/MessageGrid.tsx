import { useState, useMemo } from 'react';
import { GuestbookMessage, DogBreed } from '../types';
import { DOG_BREEDS } from '../constants/dogs';
import { MessageCard } from './MessageCard';
import { RefreshCw, Search, Dog, Inbox } from 'lucide-react';

interface MessageGridProps {
  messages: GuestbookMessage[];
  isLoading: boolean;
  onRefresh: () => void;
  onPawClick: (id: string | number) => void;
  isConnected: boolean;
}

export function MessageGrid({
  messages,
  isLoading,
  onRefresh,
  onPawClick,
  isConnected
}: MessageGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | DogBreed>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchBreed = selectedFilter === 'all' || msg.dogBreed === selectedFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        msg.name.toLowerCase().includes(q) || 
        msg.message.toLowerCase().includes(q);
      return matchBreed && matchQuery;
    });
  }, [messages, selectedFilter, searchQuery]);

  const filterTabs: Array<{ id: 'all' | DogBreed; label: string; emoji: string }> = [
    { id: 'all', label: '전체 보기', emoji: '✨' },
    { id: 'retriever', label: '리트리버', emoji: '🐶' },
    { id: 'corgi', label: '웰시코기', emoji: '🦊' },
    { id: 'maltese', label: '말티즈', emoji: '🐩' },
    { id: 'shiba', label: '시바견', emoji: '🐕' },
    { id: 'poodle', label: '푸들', emoji: '🐩' },
    { id: 'beagle', label: '비글', emoji: '🐾' }
  ];

  return (
    <section id="list-section" className="scroll-mt-20 space-y-6">
      
      {/* Top Header & Search / Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 font-gaegu flex items-center gap-2">
              <span>남겨진 멍멍 응원들</span>
              <span className="text-xl">💌</span>
            </h2>
            <span className="text-xs text-slate-500 tabular-nums font-semibold">
              총 {filteredMessages.length}개
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isConnected ? '구글 스프레드시트에서 실시간으로 불러온 목록입니다.' : '체험 모드 메시지 목록입니다.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="작성자 또는 응원글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-amber-900 bg-white border border-slate-200 hover:border-amber-300 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="새로고침 (구글 시트 동기화)"
            aria-label="방명록 새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      {isLoading && messages.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white/60 rounded-2xl border border-dashed border-amber-200">
          <div className="relative mb-3">
            <div className="w-12 h-12 rounded-full border-3 border-amber-200 border-t-amber-800 animate-spin"></div>
            <span className="absolute inset-0 flex items-center justify-center text-lg">🐾</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">구글 시트에서 응원글을 불러오는 중...</p>
          <p className="text-xs text-slate-400 mt-1">잠시만 기다려주세요 멍!</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-amber-200/70 p-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-2xl mb-3">
            🐶
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {searchQuery ? '검색 결과가 없습니다' : '아직 작성된 응원글이 없습니다'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            {searchQuery 
              ? '다른 키워드로 검색하거나 품종 필터를 확인해보세요.' 
              : '가장 먼저 따뜻한 응원의 한마디와 발도장을 남겨주세요!'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              검색 필터 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMessages.map((msg) => (
            <MessageCard
              key={msg.id}
              item={msg}
              onPawClick={onPawClick}
            />
          ))}
        </div>
      )}

    </section>
  );
}
