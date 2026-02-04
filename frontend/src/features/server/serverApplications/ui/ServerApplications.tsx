import { Flex, Loader, Pagination, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';

import { ServerApplicationItem } from './ServerApplicationItem';

import { getServerApplications } from '~/entities/serverApplications';
import { PAGE_SIZE } from '~/features/server/serverApplications/model/const';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';

export const ServerApplications = () => {
  const dispatch = useAppDispatch();
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const {
    serverApplications,
    serverApplicationsLoadingState,
    serverPage,
    serverTotal,
  } = useAppSelector((state) => state.serverApplicationsStore);

  const handleChangePage = (value: number) => {
    if (currentServerId) {
      dispatch(
        getServerApplications({
          serverId: currentServerId,
          page: value,
          size: PAGE_SIZE,
        }),
      );
    }
  };

  useEffect(() => {
    if (currentServerId) {
      dispatch(
        getServerApplications({
          serverId: currentServerId,
          page: 1,
          size: PAGE_SIZE,
        }),
      );
    }
  }, [dispatch, currentServerId]);

  return (
    <Stack gap="md">
      <Text size="lg" w={500}>
        Заявки на вступление
      </Text>
      {serverApplicationsLoadingState === LoadingState.PENDING ? (
        <Flex w="100%" justify="center">
          <Loader />
        </Flex>
      ) : (
        serverApplications.map((application) => (
          <ServerApplicationItem
            key={application.applicationId}
            application={application}
          />
        ))
      )}
      <Flex w="100%" justify="center">
        {serverApplications.length > 0 && (
          <Pagination
            total={serverTotal}
            value={serverPage}
            onChange={handleChangePage}
          />
        )}
      </Flex>
    </Stack>
  );
};
