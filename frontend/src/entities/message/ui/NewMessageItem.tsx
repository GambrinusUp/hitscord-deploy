import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  Notification,
  Stack,
  Text,
} from '@mantine/core';
import { EllipsisVertical, Reply } from 'lucide-react';
import { useMemo, useState } from 'react';

import { messageItemStyles } from './MessageItem.style';
import { MessageFiles } from './NewMessageFiles';

import { formatMessage } from '~/entities/message/lib/formatMessage';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import { MessageItemProps } from '~/entities/message/model/types';
import { setCurrentSubChatId, setSubChatInfo } from '~/entities/subChat';
import { formatDateTime } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { useChannelPermissions } from '~/widgets/messagesList/lib/useChannelPermissions';

export const MessageItem = ({
  type,
  isOwnMessage,
  content,
  replyMessage,
  time,
  modifiedAt,
  authorId,
  channelId,
  files,
  onReplyMessage,
  onEditMessage,
  onReplyPreviewClick,
  MessageActions,
  nestedChannel,
  isTagged,
}: MessageItemProps) => {
  const dispatch = useAppDispatch();
  const { serverData, currentChannelId, currentNotificationChannelId } =
    useAppSelector((state) => state.testServerStore);
  const activeChannelId = currentChannelId ?? currentNotificationChannelId;
  const canDeleteOthersMessages =
    serverData.permissions.canDeleteOthersMessages;
  const canEditMessage =
    isOwnMessage || (activeChannelId && canDeleteOthersMessages);

  const [isHovered, setIsHovered] = useState(false);
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { canWrite } = useChannelPermissions();

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );

  const { iconBase64 } = useIcon(userIcon);

  const handleOpenSubChat = (subChannelId: string | undefined) => {
    dispatch(setCurrentSubChatId(subChannelId!));
    dispatch(
      setSubChatInfo({
        subChannelId: subChannelId!,
        canUse: nestedChannel!.canUse!,
        isNotifiable: nestedChannel!.isNotifiable!,
        isOwner: isOwnMessage,
      }),
    );
  };

  return (
    <Group
      justify="space-between"
      align="flex-start"
      style={{
        flexDirection: isOwnMessage ? 'row' : 'row-reverse',
        ...messageItemStyles.container(),
      }}
      grow
      onMouseEnter={(e) => {
        setIsHovered(true);

        if (e.currentTarget) {
          e.currentTarget.style.backgroundColor = 'var(--color-white-02)';
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);

        if (e.currentTarget) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group
        gap="xs"
        justify={isOwnMessage ? 'flex-start' : 'flex-end'}
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {canWrite && (
          <ActionIcon
            variant="subtle"
            aria-label="reply"
            onClick={onReplyMessage}
            style={messageItemStyles.actionButtons()}
            color="blue"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-10)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Reply size={18} />
          </ActionIcon>
        )}
        {canEditMessage && (
          <Menu position="bottom-start" shadow="md" width={150} offset={-30}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                aria-label="edit"
                onClick={() => {}}
                style={messageItemStyles.actionButtons()}
                color="gray"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-10)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <EllipsisVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {MessageActions && (
                <MessageActions
                  onEdit={() => onEditMessage?.()}
                  isOwnMessage={isOwnMessage}
                />
              )}
            </Menu.Dropdown>
          </Menu>
        )}
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
        >
          <Group
            gap="xs"
            style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
          >
            <Text
              fw={500}
              style={{
                ...messageItemStyles.breakText(),
                color: 'var(--color-white)',
              }}
            >
              {userName}
            </Text>
            <Text
              size="xs"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {formatDateTime(time)}
            </Text>
            {modifiedAt && (
              <Text
                size="xs"
                fs="italic"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                (изменено)
              </Text>
            )}
          </Group>
          <Box
            style={messageItemStyles.box(isOwnMessage, false, isTagged)}
            onMouseEnter={(e) => {
              if (!isTagged) {
                if (isOwnMessage) {
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px var(--color-primary-20), 0 2px 4px rgba(0, 0, 0, 0.15)';
                } else {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!isTagged) {
                const baseShadow = isOwnMessage
                  ? '0 2px 8px var(--color-primary-20), 0 1px 2px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.boxShadow = baseShadow;
              }
            }}
          >
            {replyMessage && (
              <Notification
                title={
                  <Group gap="xs">
                    <Reply size={12} />
                    <Text size="sm" fw={500}>
                      {getUsername(replyMessage.authorId)}
                    </Text>
                  </Group>
                }
                withCloseButton={false}
                onClick={() => onReplyPreviewClick?.(replyMessage.id)}
                style={{
                  backgroundColor: 'var(--color-white-05)',
                  border: '1px solid var(--border-primary-soft)',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  cursor: onReplyPreviewClick ? 'pointer' : 'default',
                }}
              >
                <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {replyMessage.text}
                </Text>
              </Notification>
            )}
            <Text
              style={messageItemStyles.breakText()}
              dangerouslySetInnerHTML={{
                __html: content ? formatMessage(content) : '',
              }}
            />
            {files && files.length > 0 && (
              <MessageFiles files={files} channelId={channelId} />
            )}
            {nestedChannel && nestedChannel.canUse && (
              <Button
                radius="md"
                variant="light"
                color="blue"
                onClick={() => handleOpenSubChat(nestedChannel?.subChannelId)}
                style={{
                  marginTop: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 8px var(--color-primary-20)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Открыть подчат
              </Button>
            )}
          </Box>
        </Stack>
      </Group>
    </Group>
  );
};
