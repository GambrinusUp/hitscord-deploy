import type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type {
  Bot,
  BotLog,
  CreateBotRequest,
  BotWithApiKey,
} from '~/entities/bots/model/types';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getBots,
  createBot,
  getBotById,
  deleteBot,
  regenerateBotToken,
  revokeBotTokens,
  getBotLogs,
  clearBotLogs,
} from './bots';

export const useBots = (
  options?: Omit<UseQueryOptions<Bot[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['bots'],
    queryFn: getBots,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!localStorage.getItem('accessToken'),
    ...options,
  });
};

export const useBot = (
  id: string,
  options?: Omit<UseQueryOptions<Bot, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['bot', id],
    queryFn: () => getBotById(id),
    enabled: !!id && !!localStorage.getItem('accessToken'),
    ...options,
  });
};

export const useDeleteBot = (
  options?: UseMutationOptions<void, Error, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBot,
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ['bots'] });
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export const useCreateBot = (
  options?: UseMutationOptions<BotWithApiKey, Error, CreateBotRequest>,
) => {
  return useMutation({
    mutationFn: createBot,
    ...options,
  });
};

export const useRegenerateBotToken = (
  options?: UseMutationOptions<string, Error, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateBotToken,
    ...options,
    onSuccess: async (data, ...args) => {
      const [id] = args;
      await queryClient.invalidateQueries({ queryKey: ['bot', id] });
      if (options?.onSuccess) {
        options.onSuccess(data, ...args);
      }
    },
  });
};

export const useRevokeBotTokens = (
  options?: UseMutationOptions<void, Error, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeBotTokens,
    ...options,
    onSuccess: async (_, id, ...args) => {
      await queryClient.invalidateQueries({ queryKey: ['bot', id] });
      if (options?.onSuccess) {
        options.onSuccess(_, id, ...args);
      }
    },
  });
};

export const useBotLogs = (
  id: string,
  serverId: string,
  options?: Omit<UseQueryOptions<BotLog[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['bot-logs', id, serverId],
    queryFn: () => getBotLogs(id, serverId),
    enabled: !!id && !!serverId && !!localStorage.getItem('accessToken'),
    ...options,
  });
};

export const useClearBotLogs = (
  options?: UseMutationOptions<void, Error, { id: string; serverId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, serverId }) => clearBotLogs(id, serverId),
    onSuccess: async (_, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: ['bot-logs', variables.id, variables.serverId],
      });
      if (options?.onSuccess) {
        options.onSuccess(_, variables, ...rest);
      }
    },
    ...options,
  });
};
