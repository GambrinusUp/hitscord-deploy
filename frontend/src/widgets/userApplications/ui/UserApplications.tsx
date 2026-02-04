import {
  Flex,
  Loader,
  Pagination,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { useEffect } from 'react';

import { UserApplicationItem } from './UserApplicationItem';

import { getUserApplications } from '~/entities/serverApplications';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { PAGE_SIZE } from '~/widgets/userApplications/model/const';

export const UserApplications = () => {
  const dispatch = useAppDispatch();
  const {
    userApplications,
    userApplicationsLoadingState,
    userPage,
    userTotal,
  } = useAppSelector((state) => state.serverApplicationsStore);

  const handleChangePage = (value: number) => {
    dispatch(
      getUserApplications({
        page: value,
        size: PAGE_SIZE,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      getUserApplications({
        page: 1,
        size: PAGE_SIZE,
      }),
    );
  }, [dispatch]);

  return (
    <Stack w="100%" gap="md" p="md">
      <Title order={1}>Заявки на вступление в сервер</Title>
      <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
        <Stack gap="xs" align="center">
          {userApplicationsLoadingState === LoadingState.PENDING ? (
            <Flex w="100%" justify="center">
              <Loader />
            </Flex>
          ) : (
            userApplications.map((application) => (
              <UserApplicationItem
                key={application.applicationId}
                application={application}
              />
            ))
          )}
        </Stack>
      </ScrollArea>
      <Flex w="100%" justify="center">
        {userApplications.length > 0 && (
          <Pagination
            total={userTotal}
            value={userPage}
            onChange={handleChangePage}
          />
        )}
      </Flex>
    </Stack>
  );
};
