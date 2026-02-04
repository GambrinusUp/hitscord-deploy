import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Table,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, Trash } from 'lucide-react';
import { useEffect } from 'react';

import {
  createPreset,
  deletePreset,
  getPresets,
  getSystemRoles,
} from '~/entities/presets';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { LoadingState } from '~/shared';

interface ManagePresetsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ManagePresetsModal = ({
  opened,
  onClose,
}: ManagePresetsModalProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { currentServerId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { systemRoles, systemRolesLoading, presets, presetsLoading } =
    useAppSelector((state) => state.presetsStore);
  const form = useForm({
    initialValues: {
      systemRoleId: '',
      serverRoleId: '',
    },
    validate: {
      systemRoleId: (value) => (value ? null : 'Выберите системную роль'),
      serverRoleId: (value) => (value ? null : 'Выберите роль сервера'),
    },
  });

  const serverRolesOptions = serverData.roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const systemRolesOptions = systemRoles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleAddPreset = async (values: typeof form.values) => {
    const result = await dispatch(
      createPreset({
        serverId: currentServerId!,
        serverRoleId: values.serverRoleId,
        systemRoleId: values.systemRoleId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Пресет успешно создан');
      form.reset();
    }
  };

  const handleDeletePreset = async (
    serverRoleId: string,
    systemRoleId: string,
  ) => {
    const result = await dispatch(
      deletePreset({
        serverId: currentServerId!,
        serverRoleId,
        systemRoleId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Пресет успешно удален');
    }
  };

  useEffect(() => {
    if (opened && currentServerId) {
      if (systemRoles.length === 0) {
        dispatch(getSystemRoles({ serverId: currentServerId }));
      }

      if (presets.length === 0) {
        dispatch(getPresets({ serverId: currentServerId }));
      }
    }
  }, [opened, currentServerId, systemRoles.length, presets.length, dispatch]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Управление пресетами сервера"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
      size="70vw"
    >
      <ScrollArea.Autosize w="100%" h="100%">
        <Stack gap="md">
          <Title order={4}>Системные роли</Title>
          {systemRolesLoading === LoadingState.PENDING ? (
            <Loader />
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Тип</Table.Th>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Родительская роль</Table.Th>
                  <Table.Th>ID родительской роли</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {systemRoles.map((role) => (
                  <Table.Tr key={role.name}>
                    <Table.Td>{role.name}</Table.Td>
                    <Table.Td>{role.type}</Table.Td>
                    <Table.Td>{role.id}</Table.Td>
                    <Table.Td>{role.parentName}</Table.Td>
                    <Table.Td>{role.parentId}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          <Title order={4}>Создать пресет</Title>
          <form onSubmit={form.onSubmit(handleAddPreset)}>
            <Group gap="md" grow>
              <Select
                radius="md"
                placeholder="Выберите роль сервера"
                data={serverRolesOptions}
                {...form.getInputProps('serverRoleId')}
              />
              <Select
                radius="md"
                placeholder="Выберите системную роль"
                data={systemRolesOptions}
                {...form.getInputProps('systemRoleId')}
              />
              <Button leftSection={<Plus />} radius="md" type="submit">
                Создать
              </Button>
            </Group>
          </form>
          <Title order={4}>Существующие пресеты</Title>
          {presetsLoading === LoadingState.PENDING ? (
            <Loader />
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Роль сервера</Table.Th>
                  <Table.Th>Системная роль</Table.Th>
                  <Table.Th>Действия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {presets.map((preset, index) => (
                  <Table.Tr
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${preset.serverRoleId}-${preset.systemRoleId}-${index}`}
                  >
                    <Table.Td>{preset.serverRoleName}</Table.Td>
                    <Table.Td>{preset.systemRoleName}</Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() =>
                          handleDeletePreset(
                            preset.serverRoleId,
                            preset.systemRoleId,
                          )
                        }
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
};
