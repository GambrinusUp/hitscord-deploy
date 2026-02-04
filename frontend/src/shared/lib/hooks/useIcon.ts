import { useEffect, useState } from 'react';

import { getIcon } from '~/entities/files';

const iconCache = new Map<string, string>();
const failedToLoad = new Set<string>();
const iconLoadingMap = new Map<string, Promise<string>>();

export const useIcon = (fileId?: string, options: { skip?: boolean } = {}) => {
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.skip || !fileId) {
      setIconBase64(null);

      return;
    }

    if (failedToLoad.has(fileId)) {
      setError('Failed to load icon');
      setIconBase64(null);

      return;
    }

    if (iconCache.has(fileId)) {
      setIconBase64(iconCache.get(fileId)!);

      return;
    }

    let promise = iconLoadingMap.get(fileId);

    if (!promise) {
      promise = getIcon(fileId)
        .then((iconData) => {
          const dataUrl = `data:${iconData.fileType};base64,${iconData.base64File}`;
          iconCache.set(fileId, dataUrl);
          failedToLoad.delete(fileId);

          return dataUrl;
        })
        .catch((err) => {
          console.error('Error fetching icon:', err);
          failedToLoad.add(fileId);
          throw err;
        })
        .finally(() => {
          iconLoadingMap.delete(fileId);
        });

      iconLoadingMap.set(fileId, promise);
    }

    setLoading(true);
    promise
      .then((dataUrl) => {
        setIconBase64(dataUrl);
        setError(null);
      })
      .catch(() => {
        setIconBase64(null);
        setError('Failed to load icon');
      })
      .finally(() => setLoading(false));
  }, [fileId, options.skip]);

  const refetch = async () => {
    if (!fileId) return;

    iconCache.delete(fileId);
    failedToLoad.delete(fileId);
    iconLoadingMap.delete(fileId);

    setLoading(true);

    try {
      const iconData = await getIcon(fileId);
      const dataUrl = `data:${iconData.fileType};base64,${iconData.base64File}`;

      iconCache.set(fileId, dataUrl);
      setIconBase64(dataUrl);
      setError(null);
    } catch (err) {
      console.error('Error refetching icon:', err);
      setError('Failed to reload icon');
      failedToLoad.add(fileId);
      setIconBase64(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    iconBase64,
    loading,
    error,
    refetch,
    isEmpty: !fileId,
  };
};
