import { Stack, Text } from '@mantine/core';

import { UserCard } from '~/entities/friendship';
import { ApproveApplication, DeclineApplication } from '~/features/friendship';
import { useAppSelector } from '~/hooks';

export const ApplicationToList = () => {
  const { applicationTo } = useAppSelector((state) => state.friendshipStore);

  return (
    <Stack p="xs" gap="xs">
      {applicationTo.length < 1 && <Text>Заявок нет</Text>}
      {applicationTo.map((application) => (
        <UserCard
          key={application.id}
          userName={application.user.userName}
          userTag={application.user.userTag}
          actions={
            <>
              <ApproveApplication applicationId={application.id} />
              <DeclineApplication applicationId={application.id} />
            </>
          }
        />
      ))}
    </Stack>
  );
};
