import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { clearTokens, refreshTokens } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { api } from '~/shared/api';
import { TokenType } from '~/shared/lib/types';

const EXCLUDED_FROM_ACCESS_TOKEN = [
  '/auth/registration',
  '/auth/login',
  '/auth/refresh',
];

type Props = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const { accessToken, refreshToken } = useAppSelector(
    (state) => state.userStore,
  );

  const tokensRef = useRef({ access: '', refresh: '' });
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef<
    {
      resolve: (value?: unknown) => void;
      reject: (error?: unknown) => void;
    }[]
  >([]);

  useEffect(() => {
    tokensRef.current.access = accessToken || '';
    tokensRef.current.refresh = refreshToken || '';
  }, [accessToken, refreshToken]);

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueueRef.current = [];
  };

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const url = config.url || '';

        if (!EXCLUDED_FROM_ACCESS_TOKEN.includes(url)) {
          const token =
            tokensRef.current.access || localStorage.getItem(TokenType.ACCESS);

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalRequest.url?.includes('/auth/logout')
        ) {
          const refreshTokenValue =
            tokensRef.current.refresh ||
            localStorage.getItem(TokenType.REFRESH);

          if (!refreshTokenValue || originalRequest.url?.includes('/refresh')) {
            dispatch(clearTokens());
            localStorage.removeItem(TokenType.ACCESS);
            localStorage.removeItem(TokenType.REFRESH);

            return Promise.reject(error);
          }

          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({
                resolve: (token) => {
                  if (token && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(api(originalRequest));
                },
                reject: (err) => {
                  reject(err);
                },
              });
            });
          }

          isRefreshingRef.current = true;

          try {
            const response = await dispatch(
              refreshTokens({ refreshToken: refreshTokenValue }),
            ).unwrap();

            const newAccessToken = response.accessToken;
            const newRefreshToken = response.refreshToken;

            localStorage.setItem(TokenType.ACCESS, newAccessToken);
            localStorage.setItem(TokenType.REFRESH, newRefreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);

            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            dispatch(clearTokens());
            localStorage.removeItem(TokenType.ACCESS);
            localStorage.removeItem(TokenType.REFRESH);

            return Promise.reject(refreshError);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        return Promise.reject(error);
      },
    );

    setIsInitialized(true);

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

  if (!isInitialized) return null;

  return <>{children}</>;
};
