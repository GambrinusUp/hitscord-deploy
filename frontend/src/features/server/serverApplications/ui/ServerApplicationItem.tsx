import { Avatar, Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { Calendar, Check, X } from 'lucide-react';

import {
  approveServerApplication,
  removeServerApplication,
  ServerApplication,
} from '~/entities/serverApplications';
import { useAppDispatch, useNotification } from '~/hooks';

interface ServerApplicationItemProps {
  application: ServerApplication;
}

export const ServerApplicationItem = ({
  application,
}: ServerApplicationItemProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();

  const { name, tag, systemRoles } = application.user;
  const date = new Date(application.createdAt).toLocaleString();

  const removeApplication = async () => {
    const result = await dispatch(
      removeServerApplication({
        applicationId: application.applicationId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Заявка отклонена');
    }
  };

  const approveApplication = async () => {
    const result = await dispatch(
      approveServerApplication({
        applicationId: application.applicationId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Заявка принята');
    }
  };

  return (
    <Card withBorder p="md" radius="md">
      <Group gap="lg">
        <Avatar size="md" color="blue">
          {name[0]}
        </Avatar>
        <Stack gap="xs">
          <Text fw={700}>{name}</Text>
          <Text c="dimmed">{tag}</Text>
          {systemRoles.map((role) => (
            <Badge key={role.name} variant="default">
              {role.name}
            </Badge>
          ))}
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
            leftSection={<Check size={16} />}
            variant="light"
            onClick={approveApplication}
          >
            Принять
          </Button>
          <Button
            radius="md"
            leftSection={<X size={16} />}
            color="red"
            variant="outline"
            onClick={removeApplication}
          >
            Отклонить
          </Button>
        </Stack>
      </Group>
    </Card>
  );
};
