import { TokenType } from '~/shared/lib/types';

export const loadTokenFromLocalStorage = (type: TokenType): string => {
  try {
    const token = localStorage.getItem(type);

    return token || '';
  } catch (error) {
    console.error('Could not load token', error);

    return '';
  }
};
