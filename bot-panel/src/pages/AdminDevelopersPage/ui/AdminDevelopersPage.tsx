import {
  AppShell,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAdminDevelopers } from '~/entities/admin';
import { AppHeader } from '~/widgets';
import { DevelopersTable } from '~/widgets/admin/DevelopersTable';

export const AdminDevelopersPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const {
    data: developers = [],
    isPending,
    isError,
  } = useAdminDevelopers(debouncedSearch, {
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const filteredDevelopers = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return developers;
    }

    return developers.filter((developer) =>
      [developer.name, developer.email, developer.id]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [developers, debouncedSearch]);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack p="md" gap="md">
          <Stack gap={2}>
            <Title order={1}>Разработчики</Title>
            <Text c="dimmed">Список разработчиков и их текущая статистика</Text>
          </Stack>

          <TextInput
            placeholder="Поиск по имени, email или id"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            leftSection={<Search size={16} />}
            maw={420}
          />

          {isPending && (
            <Stack align="center" justify="center" h="40vh">
              <Loader size="lg" />
            </Stack>
          )}

          {isError && (
            <Text c="red">Не удалось загрузить список разработчиков</Text>
          )}

          {!isPending && !isError && (
            <DevelopersTable developers={filteredDevelopers} />
          )}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
