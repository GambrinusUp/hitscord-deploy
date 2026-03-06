import { Box, Text } from '@mantine/core';

export const FileUploadOverlay = () => {
  return (
    <Box
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'var(--color-primary-10)',
        border: '2px dashed var(--border-primary-dashed)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 100,
        pointerEvents: 'none',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Text fw={500} c="var(--color-primary)">
        Отпустите файл для загрузки
      </Text>
    </Box>
  );
};
