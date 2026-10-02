export type DogBreed = 
  | 'retriever' 
  | 'corgi' 
  | 'maltese' 
  | 'shiba' 
  | 'poodle' 
  | 'beagle';

export interface DogBreedInfo {
  id: DogBreed;
  name: string;
  avatarUrl: string;
  emoji: string;
  tagline: string;
  bgTone: string;
  accentTone: string;
}

export interface GuestbookMessage {
  id: string | number;
  name: string;
  message: string;
  dogBreed: DogBreed;
  timestamp: string;
  paws: number;
  isLocalOnly?: boolean;
}

export interface GasApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  entry?: GuestbookMessage;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
