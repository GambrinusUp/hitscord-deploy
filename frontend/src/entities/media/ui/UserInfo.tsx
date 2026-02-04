import { Badge, Box, Group, Text } from '@mantine/core';

import { stylesUserInfo } from './UserInfo.style';

interface UserInfoProps {
  isSpeaking: boolean;
  userName: string;
  isStreaming: boolean;
}

export const UserInfo = ({
  isSpeaking,
  userName,
  isStreaming,
}: UserInfoProps) => {
  return (
    <Box>
      <Group justify="space-between" align="center" gap="xs">
        <Text
          fw={600}
          c={isSpeaking ? '#22c55e' : 'white'}
          size="md"
          style={stylesUserInfo.name()}
        >
          {userName}
        </Text>
      </Group>
      {isStreaming && (
        <Badge size="xs" variant="dot" color="red" mt={4}>
          Транслирует
        </Badge>
      )}
    </Box>
  );
};
