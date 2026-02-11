import { Box, Divider, ScrollArea, Stack, Text } from '@mantine/core';

import { UserItem } from './UserItem';
import { getHighestRoleType } from './UserItem/lib/getHighestRoleType';
import { getRoleName } from './UserItem/lib/getRoleName';

import { useAppSelector } from '~/hooks';
import { RoleType } from '~/store/RolesStore';
import { UserOnServer } from '~/store/ServerStore';

export const DetailsPanel = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);

  const groupedUsers = serverData.users.reduce(
    (acc, user) => {
      const highestRole = getHighestRoleType(user);

      if (!acc[highestRole]) {
        acc[highestRole] = [];
      }
      acc[highestRole].push(user);

      return acc;
    },
    {} as Record<RoleType, UserOnServer[]>,
  );

  const sortedGroups = Object.entries(groupedUsers)
    .sort(([roleTypeA], [roleTypeB]) => {
      const typeA = parseInt(roleTypeA) as RoleType;
      const typeB = parseInt(roleTypeB) as RoleType;

      return typeA - typeB;
    })
    .map(([roleType, users]) => ({
      roleType: parseInt(roleType) as RoleType,
      users: users.sort((a, b) => a.userName.localeCompare(b.userName)),
      count: users.length,
    }));

  const totalUsers = serverData.users.length;

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={300}
      h="100%"
      visibleFrom="sm"
    >
      <Stack gap="md" h="100%">
        <Text c="white">Пользователи</Text>
        <Divider color="gray" />

        <Text c="gray.6" size="sm">
          Всего: {totalUsers}
        </Text>
        <ScrollArea.Autosize mah="100%" maw="100%">
          <Stack gap="xs">
            {sortedGroups.map((group) => (
              <Box key={group.roleType}>
                <Text
                  c="gray.6"
                  size="sm"
                  style={{
                    marginBottom: '8px',
                    fontWeight: 500,
                  }}
                >
                  {getRoleName(group.roleType)} — {group.count}
                </Text>
                <Stack gap="xs" style={{ marginBottom: '16px' }}>
                  {group.users.map((user) => (
                    <UserItem key={user.userId} user={user} />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Box>
  );
};
