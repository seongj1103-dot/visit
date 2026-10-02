import { DogBreed, DogBreedInfo, GuestbookMessage } from '../types';
import corgiAvatar from '../assets/images/corgi_cheering_avatar_1790833990402.jpg';
import malteseAvatar from '../assets/images/maltese_puppy_avatar_1790834010154.jpg';
import shibaAvatar from '../assets/images/shiba_puppy_avatar_1790834024227.jpg';
import retrieverAvatar from '../assets/images/puppy_guestbook_mascot_1790833971556.jpg';

export const DOG_BREEDS: Record<DogBreed, DogBreedInfo> = {
  retriever: {
    id: 'retriever',
    name: '골든 리트리버',
    avatarUrl: retrieverAvatar,
    emoji: '🐶',
    tagline: '언제나 긍정 에너지 뿜뿜!',
    bgTone: 'bg-amber-100/60',
    accentTone: 'text-amber-800'
  },
  corgi: {
    id: 'corgi',
    name: '웰시코기',
    avatarUrl: corgiAvatar,
    emoji: '🦊',
    tagline: '통통 튀는 짧은 다리의 치명적 매력',
    bgTone: 'bg-orange-100/60',
    accentTone: 'text-orange-800'
  },
  maltese: {
    id: 'maltese',
    name: '말티즈',
    avatarUrl: malteseAvatar,
    emoji: '🐩',
    tagline: '참지 않는 순백의 천사',
    bgTone: 'bg-rose-100/60',
    accentTone: 'text-rose-800'
  },
  shiba: {
    id: 'shiba',
    name: '시바견',
    avatarUrl: shibaAvatar,
    emoji: '🐕',
    tagline: '시크하지만 속정 깊은 볼살 부자',
    bgTone: 'bg-emerald-100/60',
    accentTone: 'text-emerald-800'
  },
  poodle: {
    id: 'poodle',
    name: '토이 푸들',
    avatarUrl: malteseAvatar,
    emoji: '🐩',
    tagline: '영리하고 사교적인 곱슬머리 친구',
    bgTone: 'bg-purple-100/60',
    accentTone: 'text-purple-800'
  },
  beagle: {
    id: 'beagle',
    name: '비글',
    avatarUrl: corgiAvatar,
    emoji: '🐾',
    tagline: '지치지 않는 비타민 활력소!',
    bgTone: 'bg-yellow-100/60',
    accentTone: 'text-yellow-800'
  }
};

export const INITIAL_DEMO_MESSAGES: GuestbookMessage[] = [
  {
    id: 'demo-1',
    name: '햇살이 견주',
    message: '오늘 하루도 꼬리 살랑살랑 흔들며 힘내세요! 세상의 모든 강아지와 보호자분들 파이팅 멍멍! 🐾',
    dogBreed: 'retriever',
    timestamp: '2026-10-01 14:30',
    paws: 18,
    isLocalOnly: true
  },
  {
    id: 'demo-2',
    name: '코기엉덩이',
    message: '다리가 짧아도 달릴 땐 번개처럼 빠르다구요! 힘든 일도 짧은 다리로 훌쩍 뛰어넘어봐요!',
    dogBreed: 'corgi',
    timestamp: '2026-10-01 13:15',
    paws: 24,
    isLocalOnly: true
  },
  {
    id: 'demo-3',
    name: '뽀미누나',
    message: '말티즈는 참지 않지만... 응원은 듬뿍 보내드릴게요! 맛있는 간식 챙겨드시고 기운내세요~!',
    dogBreed: 'maltese',
    timestamp: '2026-10-01 11:42',
    paws: 15,
    isLocalOnly: true
  },
  {
    id: 'demo-4',
    name: '시바누렁이',
    message: '구글 스프레드시트가 이렇게 귀여운 방명록 DB가 되다니 신기하네요! 개발자님 멋져요!',
    dogBreed: 'shiba',
    timestamp: '2026-10-01 09:20',
    paws: 31,
    isLocalOnly: true
  }
];

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ========================================================
 * 멍멍 방명록 (Puppy Guestbook) Google Apps Script 코드
 * ========================================================
 * 이 코드를 구글 스프레드시트의 [확장 프로그램] > [Apps Script]에 
 * 붙여넣고 [배포] > [새 배포] > [웹 앱]으로 배포하세요.
 * 
 * [주의!] 웹 앱 배포 시:
 * - 다음 사용자로 실행: 나(내 계정)
 * - 액세스 권한: 모든 사용자 (Anyone) - 필수!
 */

// 1. GET: 방명록 글 목록 조회
function doGet(e) {
  try {
    var sheet = getOrCreateGuestbookSheet();
    var data = sheet.getDataRange().getValues();
    var messages = [];
    
    // 1행(헤더)을 제외하고 데이터 순회
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // 최소 작성자 또는 내용이 있는 경우에만 포함
      if (row[1] || row[2]) {
        var dateFormatted = "";
        if (row[0]) {
          try {
            dateFormatted = Utilities.formatDate(new Date(row[0]), "Asia/Seoul", "yyyy-MM-dd HH:mm");
          } catch(err) {
            dateFormatted = String(row[0]);
          }
        }
        messages.push({
          id: i,
          timestamp: dateFormatted,
          name: String(row[1] || "익명의 멍멍이"),
          message: String(row[2] || ""),
          dogBreed: String(row[3] || "retriever"),
          paws: Number(row[4]) || 0
        });
      }
    }
    
    // 최신 작성 글이 상단에 오도록 역순 정렬
    messages.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: messages.length,
      data: messages
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST: 새로운 방명록 글 등록
function doPost(e) {
  try {
    var sheet = getOrCreateGuestbookSheet();
    var body = {};
    
    // JSON 본문 또는 파라미터 파싱
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }
    
    var now = new Date();
    var name = String(body.name || "익명의 댕댕이").trim();
    var message = String(body.message || "").trim();
    var dogBreed = String(body.dogBreed || "retriever");
    var paws = Number(body.paws) || 0;
    
    if (!message) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "응원 메시지 내용을 입력해주세요."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 시트 마지막 줄에 추가 [작성일시, 작성자, 응원한마디, 강아지종류, 발도장수]
    sheet.appendRow([now, name, message, dogBreed, paws]);
    
    var formattedDate = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "방명록이 구글 시트에 안전하게 저장되었습니다!",
      entry: {
        id: sheet.getLastRow(),
        timestamp: formattedDate,
        name: name,
        message: message,
        dogBreed: dogBreed,
        paws: paws
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 기본 시트 및 헤더 자동 준비 함수
function getOrCreateGuestbookSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // 첫 행이 비어있으면 기본 헤더 작성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["작성일시", "작성자", "응원한마디", "강아지종류", "발도장수"]);
    var headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setBackground("#FEF3C7");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
  }
  return sheet;
}
`;
