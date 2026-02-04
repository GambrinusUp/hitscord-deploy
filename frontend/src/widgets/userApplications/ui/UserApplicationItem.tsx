import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { Calendar, X } from 'lucide-react';

import {
  removeUserApplication,
  UserApplication,
} from '~/entities/serverApplications';
import { useAppDispatch, useNotification } from '~/hooks';

interface UserApplicationItemProps {
  application: UserApplication;
}

export const UserApplicationItem = ({
  application,
}: UserApplicationItemProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();

  const { serverName } = application;
  const date = new Date(application.createdAt).toLocaleString();

  const removeApplication = async () => {
    const result = await dispatch(
      removeUserApplication({
        applicationId: application.applicationId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Заявка на вступление отменена');
    }
  };

  return (
    <Card withBorder p="md" radius="md" w="100%">
      <Group gap="lg" w="100%" justify="space-between">
        <Stack gap="xs">
          <Text fw={700}>{serverName}</Text>
        </Stack>
        <Stack gap="xs">
          <Group gap="xs">
            <Calendar size={16} />
            <Text c="dimmed">Заявка подана:</Text>
          </Group>
          <Text>{date}</Text>
        </Stack>
        <Stack gap="xs">
          <Button
            radius="md"
            leftSection={<X size={16} />}
            color="red"
            variant="outline"
            onClick={removeApplication}
          >
            Отменить
          </Button>
        </Stack>
      </Group>
    </Card>
  );
};
