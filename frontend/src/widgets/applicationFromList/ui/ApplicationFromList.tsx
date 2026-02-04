import { Stack, Text } from '@mantine/core';

import { UserCard } from '~/entities/friendship';
import { DeleteApplication } from '~/features/friendship';
import { useAppSelector } from '~/hooks';

export const ApplicationFromList = () => {
  const { applicationFrom } = useAppSelector((state) => state.friendshipStore);

  return (
    <Stack p="xs" gap="xs">
      {applicationFrom.length < 1 && <Text>Заявок нет</Text>}
      {applicationFrom.map((application) => (
        <UserCard
          key={application.id}
          userName={application.user.userName}
          userTag={application.user.userTag}
          actions={<DeleteApplication applicationId={application.id} />}
        />
      ))}
    </Stack>
  );
};
