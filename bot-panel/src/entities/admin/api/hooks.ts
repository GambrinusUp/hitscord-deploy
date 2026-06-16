import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Developer,
  RevokeAdminBotTokensPayload,
} from '~/entities/admin/model/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDeveloperById,
  getDevelopers,
  revokeAdminBotTokens,
} from './admin';

export const useAdminDevelopers = (
  search = '',
  options?: Omit<UseQueryOptions<Developer[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['admin', 'developers', search],
    queryFn: () => getDevelopers(search),
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 1000 * 30,
    ...options,
  });
};

export const useAdminDeveloper = (
  developerId: string,
  options?: Omit<UseQueryOptions<Developer, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['admin', 'developer', developerId],
    queryFn: () => getDeveloperById(developerId),
    enabled: !!developerId && !!localStorage.getItem('accessToken'),
    ...options,
  });
};

export const useRevokeAdminBotTokens = (
  options?: UseMutationOptions<void, Error, RevokeAdminBotTokensPayload>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => revokeAdminBotTokens(payload.botId),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'developers'] });

      if (variables.developerId) {
        await queryClient.invalidateQueries({
          queryKey: ['admin', 'developer', variables.developerId],
        });
      }

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};
