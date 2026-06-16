import type { UseQueryOptions } from '@tanstack/react-query';
import type { ProfileResponse } from '~/entities/auth/model/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProfile, loginUser, registerUser } from './auth';

import { clearTokens } from '~/entities/auth/model/slice';
import { useAppDispatch } from '~/shared/hooks/redux';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      dispatch({ type: 'auth/setToken', payload: data.accessToken });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      dispatch({ type: 'auth/setToken', payload: data.accessToken });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useProfile = (
  options?: Omit<UseQueryOptions<ProfileResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    enabled: !!localStorage.getItem('accessToken'),
    ...options,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return () => {
    localStorage.removeItem('accessToken');
    dispatch(clearTokens());
    queryClient.clear();
  };
};
