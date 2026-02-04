import { ActionIcon, Box, Card, Group, ScrollArea, Text } from '@mantine/core';
import { FileIcon, X } from 'lucide-react';

import { removeFile } from '~/entities/files';
import { useAppDispatch, useAppSelector } from '~/hooks';

export const AttachedFilesList = () => {
  const dispatch = useAppDispatch();
  const { uploadedFiles } = useAppSelector((state) => state.filesStore);

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile({ fileId }));
  };

  return (
    <>
      {uploadedFiles.length > 0 && (
        <Box
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            padding: '6px',
            backgroundColor: '#1E1F22',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <ScrollArea scrollbarSize={4} type="auto">
            <Group wrap="nowrap">
              {uploadedFiles.map((file) => (
                <Card
                  key={file.fileId}
                  shadow="sm"
                  padding="xs"
                  radius="md"
                  withBorder
                  style={{ minWidth: 140 }}
                >
                  <Group
                    gap="xs"
                    justify="space-between"
                    align="center"
                    wrap="nowrap"
                  >
                    <FileIcon size={16} />
                    <Text size="xs" truncate>
                      {file.fileName}
                    </Text>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => handleRemoveFile(file.fileId)}
                    >
                      <X size={14} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Group>
          </ScrollArea>
        </Box>
      )}
    </>
  );
};
