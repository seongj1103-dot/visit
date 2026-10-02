import { useState, useEffect, useCallback, useMemo } from 'react';
import { GuestbookMessage, DogBreed, ToastItem } from './types';
import { INITIAL_DEMO_MESSAGES } from './constants/dogs';
import { 
  getSavedGasUrl, 
  saveGasUrl, 
  fetchGuestbookFromGas, 
  postGuestbookToGas 
} from './utils/gasClient';
import { getSoundMuted, setSoundMuted, playPuppyWoof } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MessageForm } from './components/MessageForm';
import { MessageGrid } from './components/MessageGrid';
import { DogShowcase } from './components/DogShowcase';
import { GasGuideModal } from './components/GasGuideModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

const STORAGE_KEY_LOCAL_MESSAGES = 'puppy_guestbook_local_messages';

export default function App() {
  const [gasUrl, setGasUrl] = useState<string>(() => getSavedGasUrl());
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => getSoundMuted());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const isConnected = Boolean(gasUrl && gasUrl.trim().length > 0);

  // Helper for adding toast notifications
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load demo messages from localStorage if available, or fallback to INITIAL_DEMO_MESSAGES
  const getStoredLocalMessages = useCallback((): GuestbookMessage[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCAL_MESSAGES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse errors
    }
    return INITIAL_DEMO_MESSAGES;
  }, []);

  // Fetch messages from either GAS or local storage
  const loadMessages = useCallback(async (currentUrl: string) => {
    setIsLoading(true);
    if (currentUrl && currentUrl.trim().length > 0) {
      try {
        const remoteMessages = await fetchGuestbookFromGas(currentUrl.trim());
        setMessages(remoteMessages);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        addToast(
          'error',
          '구글 시트 데이터를 불러오지 못했습니다.',
          `${errorMsg} (체험용 데모 데이터를 임시로 표시합니다)`
        );
        setMessages(getStoredLocalMessages());
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo Mode
      setMessages(getStoredLocalMessages());
      setIsLoading(false);
    }
  }, [addToast, getStoredLocalMessages]);

  useEffect(() => {
    loadMessages(gasUrl);
  }, [gasUrl, loadMessages]);

  // Handle URL change
  const handleSaveGasUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    saveGasUrl(trimmed);
    setGasUrl(trimmed);
    if (trimmed) {
      addToast('success', '구글 시트 연동 설정 완료!', '새 스프레드시트에서 데이터를 동기화합니다.');
      loadMessages(trimmed);
    }
  };

  // Reset to demo mode
  const handleResetToDemo = () => {
    saveGasUrl('');
    setGasUrl('');
    addToast('info', '체험 데모 모드로 전환되었습니다.', '구글 시트 연동 없이 언제든 체험할 수 있습니다.');
    setMessages(getStoredLocalMessages());
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    setSoundMuted(nextState);
    if (!nextState) {
      playPuppyWoof();
    }
  };

  // Submit new cheer message
  const handleSubmitMessage = async (name: string, message: string, dogBreed: DogBreed): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (isConnected) {
        // Real Google Apps Script POST
        await postGuestbookToGas(gasUrl, {
          name,
          message,
          dogBreed,
          paws: 0
        });

        addToast(
          'success',
          '구글 시트에 등록되었습니다! 🐾',
          `"${name}"님의 따뜻한 응원 글이 스프레드시트에 실시간으로 기록되었습니다.`
        );

        // Refresh list from GAS
        await loadMessages(gasUrl);
        return true;
      } else {
        // Demo Mode - local storage
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const newMsg: GuestbookMessage = {
          id: 'local-' + Date.now(),
          name,
          message,
          dogBreed,
          timestamp: formattedDate,
          paws: 1,
          isLocalOnly: true
        };

        const updated = [newMsg, ...messages];
        setMessages(updated);
        try {
          localStorage.setItem(STORAGE_KEY_LOCAL_MESSAGES, JSON.stringify(updated));
        } catch {
          // ignore
        }

        addToast(
          'success',
          '체험 모드에 응원글이 등록되었습니다! 🐾',
          '실제 구글 시트 저장을 원하시면 상단 [구글 시트 연동]을 클릭하세요.'
        );
        return true;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addToast(
        'error',
        '등록 중 오류가 발생했습니다.',
        errorMsg
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle paw stamp click (Like)
  const handlePawClick = (id: string | number) => {
    setMessages((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, paws: item.paws + 1 };
        }
        return item;
      });
      if (!isConnected) {
        try {
          localStorage.setItem(STORAGE_KEY_LOCAL_MESSAGES, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBreedForMessage = (_breed: DogBreed) => {
    scrollToSection('write-section');
  };

  // Compute stats
  const totalMessages = messages.length;
  const totalPaws = useMemo(() => {
    return messages.reduce((acc, cur) => acc + (cur.paws || 0), 0);
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40">
      
      {/* Top Bar Contract (Strict 3 zones) */}
      <Navbar
        isConnected={isConnected}
        gasUrl={gasUrl}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsGuideOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroBanner
          totalMessages={totalMessages}
          totalPaws={totalPaws}
          isConnected={isConnected}
          onOpenGuide={() => setIsGuideOpen(true)}
          onScrollToWrite={() => scrollToSection('write-section')}
        />

        {/* Content Container (Baseline width 1200px) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 mt-6">
          
          {/* Write Cheer Message Form */}
          <MessageForm
            onSubmit={handleSubmitMessage}
            isSubmitting={isSubmitting}
            isConnected={isConnected}
          />

          {/* Guestbook Card Grid */}
          <MessageGrid
            messages={messages}
            isLoading={isLoading}
            onRefresh={() => loadMessages(gasUrl)}
            onPawClick={handlePawClick}
            isConnected={isConnected}
          />

          {/* Dog Breeds Showcase */}
          <DogShowcase
            onSelectBreedForMessage={handleSelectBreedForMessage}
          />

        </div>
      </main>

      {/* Clean Footer */}
      <Footer onOpenGuide={() => setIsGuideOpen(true)} />

      {/* Beginner Guide & GAS Setup Modal */}
      <GasGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        gasUrl={gasUrl}
        onSaveUrl={handleSaveGasUrl}
        onResetToDemo={handleResetToDemo}
        isConnected={isConnected}
      />

      {/* Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
