export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  source: string;
  formats: DownloadFormat[];
  sourceUrl?: string; // Original video URL for downloading
}

export interface DownloadFormat {
  quality: string;
  ext: string;
  size: string;
  url: string;
}

export enum AppState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
