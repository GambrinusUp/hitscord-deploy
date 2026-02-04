import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEye, IconPlayerPlay } from '@tabler/icons-react';

import { stylesCompatButtons } from './CompatButtons.style';

interface CompatButtonsProps {
  hovered: boolean;
  isPreviewActive: boolean;
  onPreviewToggle: () => void;
  onOpenStream: () => void;
}

export const CompatButtons = ({
  hovered,
  isPreviewActive,
  onPreviewToggle,
  onOpenStream,
}: CompatButtonsProps) => {
  return (
    <Group
      gap="xs"
      style={stylesCompatButtons.container(hovered)}
      className="card-buttons"
    >
      <Tooltip
        label={isPreviewActive ? 'Скрыть превью' : 'Показать превью'}
        position="top"
      >
        <ActionIcon
          variant={isPreviewActive ? 'filled' : 'light'}
          color={isPreviewActive ? 'blue' : 'gray'}
          size="md"
          onClick={onPreviewToggle}
          style={{ flex: 1 }}
        >
          <IconEye size={14} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Открыть стрим" position="top">
        <ActionIcon
          variant="filled"
          color="blue"
          size="md"
          onClick={onOpenStream}
          style={{ flex: 1 }}
        >
          <IconPlayerPlay size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
