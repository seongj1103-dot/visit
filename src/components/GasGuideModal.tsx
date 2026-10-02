import { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../constants/dogs';
import { testGasConnection } from '../utils/gasClient';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles,
  Link,
  Code2,
  ListOrdered,
  Loader2
} from 'lucide-react';

interface GasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSaveUrl: (url: string) => void;
  onResetToDemo: () => void;
  isConnected: boolean;
}

export function GasGuideModal({
  isOpen,
  onClose,
  gasUrl,
  onSaveUrl,
  onResetToDemo,
  isConnected
}: GasGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'code' | 'faq'>('guide');
  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    ok: boolean;
    latency?: number;
    count?: number;
    error?: string;
  }>({ tested: false, ok: false });

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestResult({
        tested: true,
        ok: false,
        error: '웹 앱 URL을 입력해주세요.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult({ tested: false, ok: false });

    const res = await testGasConnection(inputUrl.trim());
    setIsTesting(false);
    setTestResult({
      tested: true,
      ok: res.ok,
      latency: res.latency,
      count: res.count,
      error: res.error
    });
  };

  const handleSave = () => {
    onSaveUrl(inputUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                구글 스프레드시트 연동 & 초보자 가이드
              </h3>
              <p className="text-xs text-slate-500">
                Google Apps Script를 활용해 내 스프레드시트를 무료 데이터베이스로 연동해보세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 bg-white">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>5분 완성 연동 가이드</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Apps Script 코드 (Code.gs)</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>자주 묻는 질문 (FAQ)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Step by Step Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  스프레드시트를 DB로 쓰면 좋은 점!
                </p>
                <p className="text-amber-900/90 leading-relaxed">
                  별도 서버나 회원가입, 신용카드 등록 없이 구글 계정만 있으면 평생 무료입니다.
                  방명록에 작성된 글이 내 구글 드라이브 스프레드시트에 실시간으로 차곡차곡 쌓여 엑셀처럼 언제든 열어볼 수 있습니다!
                </p>
              </div>

              {/* Step Items */}
              <div className="space-y-4 text-sm text-slate-700">
                
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900">구글 스프레드시트 새로 만들기 (미리 구조 안 만드셔도 OK!)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      구글 드라이브(또는 <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-amber-800 underline font-semibold inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a>)에서 
                      새 스프레드시트를 생성합니다. <strong>완전 빈 시트</strong>여도 첫 글 저장 시 코드가 1행 헤더를 자동으로 채워줍니다!
                    </p>
                    
                    {/* Visual Sheet Preview Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                      <p className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span>📊</span>
                        <span>스프레드시트 1행(헤더) 컬럼 구조:</span>
                      </p>
                      <div className="grid grid-cols-5 text-center font-mono text-[11px] border border-amber-300 rounded overflow-hidden">
                        <div className="bg-amber-100 p-1.5 border-r border-amber-300 font-bold text-amber-950">A열: 작성일시</div>
                        <div className="bg-amber-100 p-1.5 border-r border-amber-300 font-bold text-amber-950">B열: 작성자</div>
                        <div className="bg-amber-100 p-1.5 border-r border-amber-300 font-bold text-amber-950">C열: 응원한마디</div>
                        <div className="bg-amber-100 p-1.5 border-r border-amber-300 font-bold text-amber-950">D열: 강아지종류</div>
                        <div className="bg-amber-100 p-1.5 font-bold text-amber-950">E열: 발도장수</div>
                        
                        <div className="bg-white p-1.5 border-t border-r border-amber-200 text-slate-400">2026-10-01 12:00</div>
                        <div className="bg-white p-1.5 border-t border-r border-amber-200 text-slate-600">행복한 리트리버</div>
                        <div className="bg-white p-1.5 border-t border-r border-amber-200 text-slate-600">오늘도 파이팅!</div>
                        <div className="bg-white p-1.5 border-t border-r border-amber-200 text-slate-500">retriever</div>
                        <div className="bg-white p-1.5 border-t border-amber-200 text-amber-800 font-bold">5</div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        ※ 수동으로 미리 만들고 싶다면 1행(A1~E1)에 위 5개 열 제목만 적어두시면 됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Apps Script 편집기 열기</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      상단 메뉴에서 <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">[확장 프로그램]</span> → 
                      <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">[Apps Script]</span>를 클릭합니다.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">코드 붙여넣기 및 저장</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      기존에 적힌 내용을 모두 지우고, 상단 <button onClick={() => setActiveTab('code')} className="text-amber-800 underline font-semibold">[Apps Script 코드]</button> 탭의 
                      내용을 그대로 복사해서 붙여넣은 뒤 <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 text-xs">Ctrl + S</kbd>(저장)를 누릅니다.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">웹 앱으로 배포하기 (⭐ 핵심 단계)</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      우측 상단의 파란색 <span className="font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">[배포]</span> 버튼 클릭 → 
                      <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">[새 배포]</span>를 누릅니다.
                    </p>
                    <ul className="text-xs text-slate-600 list-disc list-inside mt-2 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <li><strong>유형 선택</strong>: 톱니바퀴 아이콘 클릭 후 <strong>[웹 앱]</strong> 선택</li>
                      <li><strong>설명</strong>: 방명록 API (원하는 이름)</li>
                      <li><strong>다음 사용자로 실행</strong>: <strong>나(내 이메일)</strong></li>
                      <li>
                        <strong className="text-rose-600">액세스 권한: 모든 사용자 (Anyone)</strong>
                        <span className="text-[11px] text-slate-400 block ml-4">
                          ※ '나만'으로 두면 방문자 브라우저에서 데이터 조회가 차단되므로 반드시 '모든 사용자'를 선택하세요!
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">웹 앱 URL 복사 후 아래에 입력</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      배포 완료 창에 표시된 <strong>웹 앱 URL</strong> (예: <code>https://script.google.com/macros/s/.../exec</code>)을 
                      복사하여 아래의 설정 창에 붙여넣고 [연결 테스트]를 눌러보세요!
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Apps Script Code */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Code.gs 소스코드</h4>
                  <p className="text-xs text-slate-500">
                    GET(조회)과 POST(저장), 헤더 자동 생성이 포함된 스크립트입니다.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? '복사 완료!' : '전체 코드 복사'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed select-all">
                  {GOOGLE_APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q. '권한 확인' 또는 '안전하지 않은 앱' 경고창이 떠요!
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  내 구글 계정의 스프레드시트에 접근하는 권한을 확인하는 정상적인 구글 보안 절차입니다. 
                  [고급] → [OOO(으)로 이동(안전하지 않음)]을 누른 뒤 [허용]을 클릭해주시면 됩니다.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q. 코드를 고쳤는데 변경사항이 웹앱에 안 나타나요!
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Apps Script는 코드를 수정한 뒤 [배포] → [배포 관리]에서 연필 아이콘(수정)을 누르고 
                  <strong>[버전: 신규 버전]</strong>을 선택하여 다시 배포해야 변경된 로직이 반영됩니다.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q. URL이 맞는데 연결 테스트에서 오류가 발생해요!
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  URL 끝이 <code>/exec</code>로 끝나는지 확인하세요 (<code>/edit</code>나 <code>/dev</code>는 관리자 편집창 주소입니다). 
                  또한 배포 시 <strong>[액세스 권한: 모든 사용자]</strong>로 설정되어 있는지 다시 확인해 주세요.
                </p>
              </div>
            </div>
          )}

          {/* Input & Connect Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <label htmlFor="gas-url-input" className="block text-xs font-bold text-slate-900">
              구글 앱스 스크립트 웹 앱 URL (Web App URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="gas-url-input"
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setTestResult({ tested: false, ok: false });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !inputUrl.trim()}
                className="px-4 py-2.5 text-xs font-semibold bg-white border border-slate-300 hover:border-amber-400 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>연결 테스트</span>
              </button>
            </div>

            {/* Test result display */}
            {testResult.tested && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.ok 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}>
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {testResult.ok ? '구글 스프레드시트와 성공적으로 연결되었습니다!' : '연결에 실패했습니다.'}
                  </p>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    {testResult.ok 
                      ? `응답 속도: ${testResult.latency}ms · 현재 등록된 글: ${testResult.count}개` 
                      : testResult.error}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setInputUrl('');
              setTestResult({ tested: false, ok: false });
              onResetToDemo();
              onClose();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            체험(데모) 모드로 전환하기
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="w-1/2 sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {inputUrl.trim() ? '설정 저장 & 연동' : '저장'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
