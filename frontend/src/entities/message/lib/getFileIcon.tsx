import { FileArchive, FileIcon, FileText, Image } from 'lucide-react';

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <Image size={18} />;

  if (fileType.includes('pdf') || fileType.includes('text')) {
    return <FileText size={18} />;
  }

  if (fileType.includes('zip') || fileType.includes('rar')) {
    return <FileArchive size={18} />;
  }

  return <FileIcon size={18} />;
};
