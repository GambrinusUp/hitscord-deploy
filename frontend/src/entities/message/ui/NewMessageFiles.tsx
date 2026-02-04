import { Carousel } from '@mantine/carousel';
import { Box, Flex, Group, Image, Modal, Text } from '@mantine/core';
import saveAs from 'file-saver';
import { useEffect, useState } from 'react';

import { messageFilesStyles } from './MessageFiles.style';

import { MessageFile } from '~/entities/chat';
import { getFile } from '~/entities/files';
import { formatFileSize } from '~/entities/message/lib/formatFileSize';
import { getFileIcon } from '~/entities/message/lib/getFileIcon';
import { useNotification } from '~/hooks';

interface MessageFilesProps {
  files: MessageFile[];
  channelId: string;
}

export const MessageFiles = ({ files, channelId }: MessageFilesProps) => {
  const { showError } = useNotification();

  const [opened, setOpened] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [loadedImages, setLoadedImages] = useState<
    Array<{ fileId: string; name: string; src: string }>
  >([]);

  const images = files.filter((f) => f.fileType.startsWith('image/'));
  const otherFiles = files.filter((f) => !f.fileType.startsWith('image/'));

  useEffect(() => {
    if (images.length === 0) return;

    const loadAll = async () => {
      try {
        const results = await Promise.all(
          images.map(async (img) => {
            const resp = await getFile(channelId, img.fileId);

            if (!resp.base64File) return null;

            return {
              fileId: img.fileId,
              name: img.fileName,
              src: `data:${img.fileType};base64,${resp.base64File}`,
            };
          }),
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoadedImages(results.filter(Boolean) as any);
      } catch {
        showError('Ошибка загрузки изображений');
      }
    };

    loadAll();
  }, [channelId, images]);

  const openPreview = (clickedId: string) => {
    const index = loadedImages.findIndex((img) => img.fileId === clickedId);
    setPreviewIndex(index !== -1 ? index : 0);
    setOpened(true);
  };

  const downloadFile = async (file: MessageFile) => {
    try {
      const resp = await getFile(channelId, file.fileId);

      if (!resp.base64File) return;

      const byteCharacters = atob(resp.base64File);
      const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: resp.fileType });

      saveAs(blob, file.fileName);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (e) {
      showError('Ошибка загрузки файла');
    }
  };

  return (
    <>
      <Flex direction="column" gap={8} mt={8}>
        {loadedImages.length > 0 && (
          <Flex wrap="wrap" gap={8}>
            {loadedImages.map((img) => (
              <Box
                key={img.fileId}
                style={{
                  width: 180,
                  height: 180,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
                onClick={() => openPreview(img.fileId)}
              >
                <Image
                  src={img.src}
                  fit="cover"
                  width="100%"
                  height="100%"
                  alt={img.name}
                />
              </Box>
            ))}
          </Flex>
        )}

        {otherFiles.map((file) => (
          <Group
            key={file.fileId}
            gap="xs"
            style={messageFilesStyles.message()}
            onClick={() => downloadFile(file)}
          >
            {getFileIcon(file.fileType)}
            <Text size="sm" style={{ wordBreak: 'break-word' }}>
              {file.fileName}
            </Text>
            <Text size="xs" c="gray.4">
              {formatFileSize(file.fileSize)}
            </Text>
          </Group>
        ))}
      </Flex>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="lg"
        centered
        title={loadedImages[previewIndex]?.name}
      >
        {loadedImages.length > 1 ? (
          <Carousel
            withIndicators
            height={500}
            initialSlide={previewIndex}
            onSlideChange={setPreviewIndex}
          >
            {loadedImages.map((img, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Carousel.Slide key={idx}>
                <Image
                  src={img.src}
                  height={500}
                  fit="contain"
                  alt={img.name}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Image
            src={loadedImages[previewIndex]?.src}
            height={500}
            fit="contain"
          />
        )}
      </Modal>
    </>
  );
};
