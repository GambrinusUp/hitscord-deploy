import type { DocsTopic } from '~/entities/docs';

import { Box, Button, Stack, Text } from '@mantine/core';

interface DocsSidebarProps {
  activeTopicId: string;
  topics: DocsTopic[];
  onSelectTopic: (topicId: string) => void;
}

export const DocsSidebar = ({
  activeTopicId,
  topics,
  onSelectTopic,
}: DocsSidebarProps) => {
  return (
    <Box
      style={{
        position: 'sticky',
        top: 'calc(60px + 16px)',
        maxHeight: 'calc(100vh - 92px)',
        overflowY: 'auto',
      }}
    >
      <Stack gap="xs">
        <Text fw={700}>Оглавление</Text>
        {topics.map((topic) => (
          <Button
            key={topic.id}
            justify="flex-start"
            variant={activeTopicId === topic.id ? 'light' : 'subtle'}
            radius="md"
            fullWidth
            onClick={() => onSelectTopic(topic.id)}
            styles={{
              label: {
                whiteSpace: 'normal',
                textAlign: 'left',
              },
            }}
          >
            {topic.title}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
