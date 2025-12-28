
export interface HeadshotStyle {
  id: string;
  label: string;
  description: string;
  prompt: string;
  previewUrl: string;
}

export type AppState = 'IDLE' | 'UPLOADING' | 'GENERATING' | 'EDITING' | 'RESULT';

export interface ImageResult {
  url: string;
  timestamp: number;
}
