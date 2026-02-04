import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Checkbox,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { EllipsisVertical, Reply, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { pollItemStyles } from './PollItem.style';
import { VotersListModal } from './VotersListModal';

import { MessageType } from '~/entities/message';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import {
  checkUserVoted,
  checkUserVotedAll,
} from '~/entities/vote/lib/checkUserVoted';
import { getInitialData } from '~/entities/vote/lib/getInitialData';
import { PollItemProps, VoteVariantsForm } from '~/entities/vote/model/types';
import { formatDateTime } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

export const PollItem = ({
  pollId,
  authorId,
  isOwnMessage,
  type,
  time,
  title,
  content,
  variants,
  multiple,
  deadLine,
  isAnonimous,
  onReplyMessage,
  totalUsers,
}: PollItemProps) => {
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const { currentChannelId, currentNotificationChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { vote, unVote, deleteMessage, deleteChatMessage } = useWebSocket();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;
  const userId = user.id;
  const form = useForm<VoteVariantsForm>({
    initialValues: {
      votes: getInitialData(variants, userId),
    },
  });

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );
  const userVoted = checkUserVotedAll(variants, userId);
  const deadlinePassed =
    !!deadLine && new Date(deadLine).getTime() < Date.now();

  const { iconBase64 } = useIcon(userIcon);

  const getVoterNames = useCallback(
    (voterIds: string[]): string[] => {
      return voterIds.map((voterId) => {
        const userName = getUsername(voterId);

        return userName || '?';
      });
    },
    [getUsername],
  );

  const allVoterIds = useMemo(() => {
    const ids = variants.flatMap((v) => v.votedUserIds || []);

    return Array.from(new Set(ids));
  }, [variants]);

  const allVoterNames = useMemo(
    () => getVoterNames(allVoterIds),
    [getVoterNames, allVoterIds],
  );

  const groupedVariants = useMemo(
    () =>
      variants.map((v) => ({
        name: v.content,
        voterNames: getVoterNames(v.votedUserIds || []),
        count: v.votedUserIds.length,
      })),
    [variants, getVoterNames],
  );

  const handleVote = (index: number, variantId: string) => {
    const fieldName = `votes.${index}.checked`;
    const currentValue = form.getInputProps(fieldName).value;
    const newValue = !currentValue;

    if (newValue) {
      vote({
        Token: accessToken,
        VoteVariantId: variantId,
        isChannel: type === MessageType.CHANNEL ? true : false,
      });
    } else {
      unVote({
        Token: accessToken,
        VoteVariantId: variantId,
        isChannel: type === MessageType.CHANNEL ? true : false,
      });
    }

    form.setFieldValue(fieldName, newValue);
  };

  const handleDelete = () => {
    switch (type) {
      case MessageType.CHANNEL:
        deleteMessage({
          Token: accessToken,
          ChannelId: activeChannelId!,
          MessageId: pollId,
        });
        break;
      case MessageType.CHAT:
        deleteChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: pollId,
        });
        break;
    }
  };

  return (
    <Group
      justify="space-between"
      align="flex-start"
      style={{ flexDirection: isOwnMessage ? 'row' : 'row-reverse' }}
      grow
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group
        gap="xs"
        justify={isOwnMessage ? 'flex-start' : 'flex-end'}
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <ActionIcon
          variant="subtle"
          aria-label="reply"
          onClick={onReplyMessage}
        >
          <Reply size={20} />
        </ActionIcon>
        <Menu position="bottom-start" shadow="md" width={150} offset={-30}>
          <Menu.Target>
            <ActionIcon variant="subtle" aria-label="edit" onClick={() => {}}>
              <EllipsisVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Trash2 size={12} />}
              onClick={handleDelete}
            >
              Удалить
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Group
        flex={1}
        align="flex-start"
        style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
        gap="xs"
      >
        <Avatar size="md" color="blue" src={iconBase64}>
          {userName ? userName[0] : '?'}
        </Avatar>
        <Stack
          gap="xs"
          align={isOwnMessage ? 'flex-end' : 'flex-start'}
          style={{ flex: 1 }}
          w="100%"
        >
          <Group
            gap="xs"
            style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
          >
            <Text fw={500} style={pollItemStyles.breakText()}>
              {userName}
            </Text>
            <Text size="xs">{formatDateTime(time)}</Text>
          </Group>

          <Card style={pollItemStyles.card()} px="xl" miw={200}>
            <Stack gap="md">
              <Text size="lg" fw={700} c="white">
                {title}
              </Text>
              {content && <Text c="gray.4">{content}</Text>}
              {deadLine && !deadlinePassed && (
                <Text size="xs" c="gray.5">
                  Голосование до {formatDateTime(deadLine)}
                </Text>
              )}
              {deadlinePassed && (
                <Text size="xs" c="red.4">
                  Голосование завершено ({formatDateTime(deadLine)})
                </Text>
              )}
              {variants.map((variant, index) => {
                const userVote = checkUserVoted(variant, userId);
                const usersVotedPercent =
                  totalUsers > 0
                    ? Math.round(
                        (variant.votedUserIds.length / totalUsers) * 100,
                      )
                    : 0;
                const disabled =
                  deadlinePassed || (!multiple && userVoted && !userVote);

                return (
                  <Box
                    key={variant.id}
                    style={pollItemStyles.box(disabled)}
                    onClick={() => !disabled && handleVote(index, variant.id)}
                  >
                    <Box style={pollItemStyles.vote(usersVotedPercent)} />

                    <Group
                      justify="space-between"
                      align="center"
                      px="md"
                      py={8}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <Group gap="xs">
                        <Checkbox
                          {...form.getInputProps(`votes.${index}.checked`, {
                            type: 'checkbox',
                          })}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleVote(index, variant.id)}
                          styles={{
                            input: {
                              cursor: disabled ? 'not-allowed' : 'pointer',
                            },
                          }}
                          disabled={disabled}
                          radius="xl"
                        />
                        <Text
                          c={
                            disabled ? 'gray.5' : userVote ? 'white' : 'gray.2'
                          }
                          style={{
                            transition: 'color 0.2s',
                          }}
                        >
                          {variant.content}
                        </Text>
                      </Group>

                      <Text
                        size="xs"
                        c="gray.4"
                        style={{
                          cursor: !isAnonimous ? 'pointer' : 'default',
                          transition: 'color 0.2s',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (!isAnonimous) {
                            setSelectedVariantIndex(index);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!isAnonimous && variant.votedUserIds.length > 0) {
                            e.currentTarget.style.color = '#fff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
                        }}
                      >
                        {usersVotedPercent}%
                      </Text>
                    </Group>
                  </Box>
                );
              })}
            </Stack>
          </Card>

          <Text
            size="xs"
            c="gray.5"
            ta="center"
            style={{
              cursor: !isAnonimous && totalUsers > 0 ? 'pointer' : 'default',
            }}
            onClick={(e) => {
              e.stopPropagation();

              if (!isAnonimous && totalUsers > 0) {
                setSelectedVariantIndex(-1);
              }
            }}
          >
            Всего проголосовавших: {totalUsers}
          </Text>
        </Stack>
      </Group>

      <VotersListModal
        opened={selectedVariantIndex !== null}
        onClose={() => setSelectedVariantIndex(null)}
        variantName={
          selectedVariantIndex === -1
            ? 'Все варианты'
            : selectedVariantIndex !== null
              ? variants[selectedVariantIndex]?.content
              : ''
        }
        isAnonimous={isAnonimous}
        variantsCount={
          selectedVariantIndex === -1
            ? totalUsers
            : selectedVariantIndex !== null
              ? variants[selectedVariantIndex].votedUserIds.length
              : 0
        }
        voterNames={
          selectedVariantIndex === -1
            ? allVoterNames
            : selectedVariantIndex !== null
              ? getVoterNames(variants[selectedVariantIndex].votedUserIds)
              : []
        }
        groupedVariants={
          selectedVariantIndex === -1 ? groupedVariants : undefined
        }
      />
    </Group>
  );
};
