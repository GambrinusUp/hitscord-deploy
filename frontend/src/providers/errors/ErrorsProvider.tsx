import { ReactNode, useEffect } from 'react';

import { useAppSelector, useNotification } from '~/hooks';

export const ErrorsProvider = ({ children }: { children?: ReactNode }) => {
  const serverError = useAppSelector((state) => state.testServerStore.error);
  const usersError = useAppSelector((state) => state.userStore.error);
  const chatsError = useAppSelector((state) => state.chatsStore.error);
  const rolesError = useAppSelector((state) => state.rolesStore.error);
  const presetsError = useAppSelector((state) => state.presetsStore.error);
  const serverApplicationsError = useAppSelector(
    (state) => state.serverApplicationsStore.error,
  );

  const { showError } = useNotification();

  useEffect(() => {
    if (serverError !== '') {
      showError(serverError);
    }
  }, [serverError]);

  useEffect(() => {
    if (usersError !== '') {
      showError(usersError);
    }
  }, [usersError]);

  useEffect(() => {
    if (chatsError !== '') {
      showError(chatsError);
    }
  }, [chatsError]);

  useEffect(() => {
    if (rolesError !== '') {
      showError(rolesError);
    }
  }, [rolesError]);

  useEffect(() => {
    if (presetsError !== '') {
      showError(presetsError);
    }
  }, [presetsError]);

  useEffect(() => {
    if (serverApplicationsError !== '') {
      showError(serverApplicationsError);
    }
  }, [serverApplicationsError]);

  return <>{children}</>;
};
