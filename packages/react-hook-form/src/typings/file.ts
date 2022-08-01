export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error';

export type UploadResponse = {
  id: string;
};
