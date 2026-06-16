import type { ReactNode } from 'react';
import type { UserRoleType } from '~/entities/auth';

import { Center, Loader } from '@mantine/core';
import { Navigate } from 'react-router-dom';

import { UserRole, useProfile } from '~/entities/auth';
import { useAppSelector } from '~/shared/hooks/redux';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRoleType[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isLoggedIn } = useAppSelector((state) => state.authStore);
  const { data: profile, isPending } = useProfile({ enabled: isLoggedIn });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isPending) {
    return (
      <Center h="100vh">
        <Loader size="md" />
      </Center>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const fallbackPath =
      profile.role === UserRole.ADMIN ? '/admin/developers' : '/dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
