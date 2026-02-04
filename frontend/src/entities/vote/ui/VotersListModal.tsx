import { Avatar, Badge, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import { IconCheck, IconUserOff, IconUsers } from '@tabler/icons-react';

import { stylesVotersListModal } from './VotersListModal.style';

interface VotersListModalProps {
  opened: boolean;
  onClose: () => void;
  variantName: string;
  isAnonimous: boolean;
  variantsCount: number;
  voterNames: string[];
  groupedVariants?: {
    name: string;
    voterNames: string[];
    count: number;
  }[];
}

export const VotersListModal = ({
  opened,
  onClose,
  variantName,
  isAnonimous,
  variantsCount,
  voterNames,
  groupedVariants,
}: VotersListModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs" align="center">
          <IconUsers size={20} color="#3b82f6" />
          <Text fw={600} size="lg">
            Проголосовавшие за:
          </Text>
          <Text fw={500} c="blue.4" style={stylesVotersListModal.variantName()}>
            {variantName}
          </Text>
        </Group>
      }
      radius="md"
      centered
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={stylesVotersListModal.modalRoot()}
    >
      <Stack gap="sm">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="gray.4">
            Всего: {variantsCount}
          </Text>
          {!isAnonimous && (
            <Badge
              variant="light"
              color="blue"
              size="sm"
              leftSection={<IconCheck size={12} />}
            >
              Публичное голосование
            </Badge>
          )}
        </Group>
        {groupedVariants ? (
          <Stack gap="sm">
            {groupedVariants.map((group) => (
              <div key={group.name}>
                <Group align="center" gap="xs">
                  <Text fw={600}>{group.name}</Text>
                  <Text size="sm" c="gray.4">
                    — {group.count}
                  </Text>
                </Group>

                {group.voterNames.length > 0 ? (
                  <Stack gap={8}>
                    {group.voterNames.map((voterName, index) => (
                      <Paper
                        key={voterName}
                        p="sm"
                        style={stylesVotersListModal.userContainer(index)}
                      >
                        <Group justify="space-between">
                          <Group gap="sm">
                            <Avatar
                              size="sm"
                              radius="xl"
                              color="blue"
                              styles={{
                                placeholder: {
                                  background:
                                    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                },
                              }}
                            >
                              {voterName[0].toUpperCase()}
                            </Avatar>
                            <Text fw={500} c="gray.1">
                              {voterName}
                            </Text>
                          </Group>
                          <Badge
                            variant="dot"
                            color="blue"
                            size="sm"
                            style={{
                              background: 'rgba(59, 130, 246, 0.15)',
                            }}
                          >
                            Проголосовал
                          </Badge>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Paper
                    p="xl"
                    style={stylesVotersListModal.noVotesContainer()}
                  >
                    <Stack align="center" gap="md">
                      <IconUserOff
                        size={48}
                        color="rgba(59, 130, 246, 0.5)"
                        stroke={1}
                      />
                      <Text ta="center" c="gray.5" fw={500} mb={4}>
                        Нет проголосовавших
                      </Text>
                    </Stack>
                  </Paper>
                )}
              </div>
            ))}
          </Stack>
        ) : voterNames.length > 0 ? (
          <Stack gap={8}>
            {voterNames.map((voterName, index) => (
              <Paper
                key={voterName}
                p="sm"
                style={stylesVotersListModal.userContainer(index)}
              >
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="blue"
                      styles={{
                        placeholder: {
                          background:
                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        },
                      }}
                    >
                      {voterName[0].toUpperCase()}
                    </Avatar>
                    <Text fw={500} c="gray.1">
                      {voterName}
                    </Text>
                  </Group>
                  <Badge
                    variant="dot"
                    color="blue"
                    size="sm"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                    }}
                  >
                    Проголосовал
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Paper p="xl" style={stylesVotersListModal.noVotesContainer()}>
            <Stack align="center" gap="md">
              <IconUserOff
                size={48}
                color="rgba(59, 130, 246, 0.5)"
                stroke={1}
              />
              <Text ta="center" c="gray.5" fw={500} mb={4}>
                Нет проголосовавших
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Modal>
  );
};
