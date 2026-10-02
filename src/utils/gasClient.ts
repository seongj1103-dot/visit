import { GasApiResponse, GuestbookMessage } from '../types';

export const STORAGE_KEY_GAS_URL = 'puppy_guestbook_gas_url';

export function getSavedGasUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_GAS_URL) || '';
  } catch {
    return '';
  }
}

export function saveGasUrl(url: string): void {
  try {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY_GAS_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GAS_URL);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Fetch messages from Google Apps Script Web App
 */
export async function fetchGuestbookFromGas(gasUrl: string): Promise<GuestbookMessage[]> {
  const cleanUrl = gasUrl.trim();
  if (!cleanUrl) {
    throw new Error('Google Apps Script URL이 설정되지 않았습니다.');
  }

  // Add cache buster parameter to avoid browser caching
  const fetchUrl = new URL(cleanUrl);
  fetchUrl.searchParams.set('_t', Date.now().toString());

  const response = await fetch(fetchUrl.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`구글 시트 응답 오류: HTTP ${response.status} (${response.statusText})`);
  }

  const result: GasApiResponse<GuestbookMessage[]> = await response.json();

  if (result.status === 'error') {
    throw new Error(result.message || '스프레드시트에서 데이터를 가져오는 데 실패했습니다.');
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return [];
}

/**
 * Submit a new guestbook message to Google Apps Script Web App
 */
export async function postGuestbookToGas(
  gasUrl: string, 
  data: Omit<GuestbookMessage, 'id' | 'timestamp'>
): Promise<{ success: boolean; entry?: GuestbookMessage; message?: string }> {
  const cleanUrl = gasUrl.trim();
  if (!cleanUrl) {
    throw new Error('Google Apps Script URL이 설정되지 않았습니다.');
  }

  const payload = {
    name: data.name,
    message: data.message,
    dogBreed: data.dogBreed,
    paws: data.paws || 0
  };

  // Google Apps Script requires Content-Type 'text/plain;charset=utf-8'
  // to prevent CORS preflight OPTIONS requests that GAS doesn't handle.
  const response = await fetch(cleanUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`저장 실패: HTTP ${response.status} (${response.statusText})`);
  }

  try {
    const result: GasApiResponse<unknown> = await response.json();
    if (result.status === 'error') {
      throw new Error(result.message || '스프레드시트 저장 중 에러가 발생했습니다.');
    }
    return {
      success: true,
      entry: result.entry,
      message: result.message
    };
  } catch (err: unknown) {
    // If response was followed through redirect and parsing succeeded or failed
    if (err instanceof Error && err.message.includes('스프레드시트')) {
      throw err;
    }
    return {
      success: true,
      message: '방명록 등록 완료!'
    };
  }
}

/**
 * Test connectivity with Google Apps Script Web App
 */
export async function testGasConnection(url: string): Promise<{ ok: boolean; latency: number; count?: number; error?: string }> {
  const startTime = performance.now();
  try {
    const messages = await fetchGuestbookFromGas(url);
    const latency = Math.round(performance.now() - startTime);
    return {
      ok: true,
      latency,
      count: messages.length
    };
  } catch (err: unknown) {
    const latency = Math.round(performance.now() - startTime);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      latency,
      error: msg
    };
  }
}
