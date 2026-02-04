import { Box, Group, Skeleton } from '@mantine/core';

export const MessageLoading = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Group align="flex-start" gap="xs" key={index}>
      <Skeleton height={40} width={40} circle />
      <Box style={{ flex: 1 }}>
        <Skeleton height={12} width="60%" radius="md" />
        <Skeleton height={10} width="40%" mt={8} radius="md" />
      </Box>
    </Group>
  ));
};
