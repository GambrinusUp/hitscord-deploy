import { Flex, Group, Loader, Text } from '@mantine/core';
import saveAs from 'file-saver';
import { useState } from 'react';

import { messageFilesStyles } from './MessageFiles.style';

import { MessageFile } from '~/entities/chat';
import { getFile } from '~/entities/files';
import { formatFileSize } from '~/entities/message/lib/formatFileSize';
import { getFileIcon } from '~/entities/message/lib/getFileIcon';
import { useNotification } from '~/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';

interface MessageFilesProps {
  files: MessageFile[];
  channelId: string;
}

/* Вынести в фичу */
export const MessageFiles = ({ files, channelId }: MessageFilesProps) => {
  const { showError } = useNotification();
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  useFileUploadNotification(loadingFileId !== null);

  const handleFileClick = async (file: MessageFile) => {
    if (loadingFileId === file.fileId) return;

    try {
      setLoadingFileId(file.fileId);

      const response = await getFile(channelId, file.fileId);

      if (!response.base64File) {
        console.error('Файл пустой или не содержит base64');
        setLoadingFileId(null);

        return;
      }

      const byteCharacters = atob(response.base64File);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.fileType });

      saveAs(blob, response.fileName);
    } catch (error) {
      showError(`Ошибка загрузки файла: ${error}`);
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <Flex direction="column" gap={6} mt={8}>
      {files.map((file) => {
        const isLoading = loadingFileId === file.fileId;

        return (
          <Group
            key={file.fileId}
            gap="xs"
            style={{
              ...messageFilesStyles.message(),
              opacity: isLoading ? 0.6 : 1,
              pointerEvents: isLoading ? 'none' : 'auto',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={() => handleFileClick(file)}
          >
            {isLoading ? <Loader size="xs" /> : getFileIcon(file.fileType)}

            <Text size="sm" style={{ wordBreak: 'break-word' }}>
              {file.fileName}
            </Text>

            <Text size="xs" c="gray.4">
              {formatFileSize(file.fileSize)}
            </Text>
          </Group>
        );
      })}
    </Flex>
  );
};
