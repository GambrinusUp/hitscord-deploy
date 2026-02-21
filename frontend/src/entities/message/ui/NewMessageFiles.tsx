import { Carousel } from '@mantine/carousel';
import { Box, Flex, Group, Image, Loader, Modal, Text } from '@mantine/core';
import saveAs from 'file-saver';
import { useEffect, useMemo, useState } from 'react';

import { messageFilesStyles } from './MessageFiles.style';

import { MessageFile } from '~/entities/chat';
import { getFile } from '~/entities/files';
import { formatFileSize } from '~/entities/message/lib/formatFileSize';
import { getFileIcon } from '~/entities/message/lib/getFileIcon';
import { useNotification } from '~/hooks';
import { useImagePreloadSetting } from '~/shared/lib/hooks';
import { useFileUploadNotification } from '~/shared/lib/hooks/useFileUploadNotification';

interface MessageFilesProps {
  files: MessageFile[];
  channelId: string;
}

type LoadedImage = { fileId: string; name: string; src: string };

const imageCache = new Map<string, LoadedImage>();
const imageLoading = new Map<string, Promise<LoadedImage | null>>();

const getCacheKey = (channelId: string, fileId: string) =>
  `${channelId}:${fileId}`;

export const MessageFiles = ({ files, channelId }: MessageFilesProps) => {
  const { showError } = useNotification();

  const [opened, setOpened] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);

  useFileUploadNotification(loadingFileId !== null);
  const { preloadImages } = useImagePreloadSetting();

  const images = useMemo(
    () => files.filter((f) => f.fileType.startsWith('image/')),
    [files],
  );
  const otherFiles = useMemo(() => {
    if (!preloadImages) return files;

    return files.filter((f) => !f.fileType.startsWith('image/'));
  }, [files, preloadImages]);
  const imagesKey = useMemo(
    () => images.map((img) => img.fileId).join('|'),
    [images],
  );
  const loadedById = useMemo(() => {
    const map = new Map<string, LoadedImage>();
    loadedImages.forEach((img) => map.set(img.fileId, img));

    return map;
  }, [loadedImages]);

  const loadImage = async (img: MessageFile) => {
    const cacheKey = getCacheKey(channelId, img.fileId);
    const cached = imageCache.get(cacheKey);

    if (cached) return cached;

    let pending = imageLoading.get(cacheKey);

    if (!pending) {
      pending = getFile(channelId, img.fileId)
        .then((resp) => {
          if (!resp.base64File) return null;

          const loaded = {
            fileId: img.fileId,
            name: img.fileName,
            src: `data:${img.fileType};base64,${resp.base64File}`,
          };

          imageCache.set(cacheKey, loaded);

          return loaded;
        })
        .finally(() => {
          imageLoading.delete(cacheKey);
        });
      imageLoading.set(cacheKey, pending);
    }

    return pending;
  };

  useEffect(() => {
    if (images.length === 0) {
      setLoadedImages([]);

      return;
    }

    if (!preloadImages) {
      setLoadedImages([]);

      return;
    }
    let isActive = true;

    const loadAll = async () => {
      try {
        const results = await Promise.all(images.map(loadImage));

        if (!isActive) return;

        setLoadedImages(results.filter(Boolean) as LoadedImage[]);
      } catch {
        if (!isActive) return;

        showError('Ошибка загрузки изображений');
      }
    };

    loadAll();

    return () => {
      isActive = false;
    };
  }, [channelId, imagesKey, preloadImages]);

  const openPreview = (clickedId: string, list = loadedImages) => {
    const index = list.findIndex((img) => img.fileId === clickedId);
    setPreviewIndex(index !== -1 ? index : 0);
    setOpened(true);
  };

  const handleImageClick = async (img: MessageFile) => {
    const existing = loadedById.get(img.fileId);

    if (existing) {
      openPreview(existing.fileId);

      return;
    }

    try {
      const loaded = await loadImage(img);

      if (!loaded) return;

      const alreadyLoaded = loadedImages.some(
        (item) => item.fileId === loaded.fileId,
      );
      const nextLoaded = alreadyLoaded
        ? loadedImages
        : [...loadedImages, loaded];

      setLoadedImages(nextLoaded);
      openPreview(loaded.fileId, nextLoaded);
    } catch {
      showError('Ошибка загрузки изображений');
    }
  };

  const downloadFile = async (file: MessageFile) => {
    if (loadingFileId === file.fileId) return;
    try {
      setLoadingFileId(file.fileId);
      const resp = await getFile(channelId, file.fileId);

      if (!resp.base64File) {
        setLoadingFileId(null);

        return;
      }

      const byteCharacters = atob(resp.base64File);
      const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: resp.fileType });

      saveAs(blob, file.fileName);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (e) {
      showError('Ошибка загрузки файла');
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <>
      <Flex direction="column" gap={8} mt={8}>
        {preloadImages && images.length > 0 && (
          <Flex wrap="wrap" gap={8}>
            {images.map((img) => {
              const loaded = loadedById.get(img.fileId);

              return (
                <Box
                  key={img.fileId}
                  style={{
                    width: 180,
                    height: 180,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 8,
                    background: 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleImageClick(img)}
                >
                  {loaded ? (
                    <Image
                      src={loaded.src}
                      fit="cover"
                      width="100%"
                      height="100%"
                      alt={loaded.name}
                    />
                  ) : (
                    <Flex direction="column" align="center" gap={6}>
                      {getFileIcon(img.fileType)}
                      <Text size="xs" c="gray.4" ta="center">
                        {img.fileName}
                      </Text>
                    </Flex>
                  )}
                </Box>
              );
            })}
          </Flex>
        )}

        {otherFiles.map((file) => {
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
              onClick={() => downloadFile(file)}
            >
              {isLoading ? (
                <Loader size="xs" />
              ) : (
                getFileIcon(
                  !preloadImages && file.fileType.startsWith('image/')
                    ? 'application/octet-stream'
                    : file.fileType,
                )
              )}
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
