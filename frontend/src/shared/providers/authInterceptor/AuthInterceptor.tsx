import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { clearTokens, getUserProfile, refreshTokens } from '~/entities/user';
import { useAppDispatch } from '~/hooks';
import { api } from '~/shared/api';

type Props = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef<
    {
      resolve: () => void;
      reject: (error?: unknown) => void;
    }[]
  >([]);

  const processQueue = (error: unknown) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });

    failedQueueRef.current = [];
  };

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.withCredentials = true;

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (InternalAxiosRequestConfig & { _retry?: boolean })
          | undefined;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest.url?.includes('/auth/logout') &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          if (originalRequest._retry) {
            dispatch(clearTokens());

            return Promise.reject(error);
          }

          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({
                resolve: () => {
                  resolve(api(originalRequest));
                },
                reject: (err) => {
                  reject(err);
                },
              });
            });
          }

          isRefreshingRef.current = true;
          originalRequest._retry = true;

          try {
            await dispatch(refreshTokens()).unwrap();
            processQueue(null);

            return api({
              ...originalRequest,
              withCredentials: true,
            });
          } catch (refreshError) {
            processQueue(refreshError);
            dispatch(clearTokens());

            return Promise.reject(refreshError);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        return Promise.reject(error);
      },
    );

    dispatch(getUserProfile())
      .unwrap()
      .catch(() => undefined)
      .finally(() => {
        setIsInitialized(true);
      });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

  if (!isInitialized) return null;

  return <>{children}</>;
};
