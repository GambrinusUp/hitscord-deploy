import { Button, Tooltip } from '@mantine/core';
import { IconEye, IconPlayerPlay } from '@tabler/icons-react';

interface ButtonsProps {
  isPreviewActive: boolean;
  onPreviewToggle: () => void;
  onOpenStream: () => void;
}

export const Buttons = ({
  isPreviewActive,
  onPreviewToggle,
  onOpenStream,
}: ButtonsProps) => {
  return (
    <>
      <Tooltip
        label={isPreviewActive ? 'Скрыть превью' : 'Показать превью'}
        position="bottom"
      >
        <Button
          variant={isPreviewActive ? 'filled' : 'light'}
          color={isPreviewActive ? 'blue' : 'gray'}
          size="xs"
          leftSection={<IconEye size={16} />}
          onClick={onPreviewToggle}
          fullWidth
        >
          Превью
        </Button>
      </Tooltip>
      <Tooltip label="Открыть стрим" position="bottom">
        <Button
          variant="filled"
          color="blue"
          size="xs"
          leftSection={<IconPlayerPlay size={16} />}
          onClick={onOpenStream}
          fullWidth
        >
          Стрим
        </Button>
      </Tooltip>
    </>
  );
};
