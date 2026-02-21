import { Paper, Stack, Text, Tooltip } from '@mantine/core';

interface InfoItemProps {
  label: string;
  value: string;
}

export const InfoItem = ({ label, value }: InfoItemProps) => (
  <Paper
    p="xs"
    radius="md"
    style={{
      background: 'var(--color-surface-3)',
      border: '1px solid var(--color-white-05)',
    }}
  >
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Tooltip label={value} withArrow>
        <Text
          size="sm"
          c="var(--color-white)"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </Text>
      </Tooltip>
    </Stack>
  </Paper>
);
