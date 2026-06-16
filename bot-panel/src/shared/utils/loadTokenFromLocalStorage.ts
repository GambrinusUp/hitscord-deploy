import type { TokenType } from '~/shared/types/types';

export const loadTokenFromLocalStorage = (type: TokenType): string => {
  try {
    const token = localStorage.getItem(type);

    return token || '';
  } catch (error) {
    console.error('Could not load token', error);

    return '';
  }
};
