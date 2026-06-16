import type { ReactNode } from 'react';

import { useEffect } from 'react';

import { useAppSelector } from '~/shared/hooks/redux';
import { useNotification } from '~/shared/hooks/useNotification';

export const ErrorsProvider = ({ children }: { children?: ReactNode }) => {
  const authError = useAppSelector((state) => state.authStore.error);
  const { showError } = useNotification();

  useEffect(() => {
    if (authError !== '') {
      showError(authError);
    }
  }, [authError]);

  return <>{children}</>;
};
