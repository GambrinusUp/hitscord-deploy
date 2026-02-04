import { LoadingState } from '~/shared';

export interface GetFile {
  channelId: string;
  fileId: string;
}

export interface AttachFileRequest {
  channelId: string;
  file: File;
}

export interface FileResponse {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  base64File?: Base64URLString;
}

export interface FilesState {
  uploadedFiles: FileResponse[];
  loading: LoadingState;
  error: string;
}
