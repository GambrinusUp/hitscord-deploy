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

import { MessageFiles } from './MessageFiles';
import { messageItemStyles } from './MessageItem.style';

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
  EditMessage,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
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
      style={{ flexDirection: isOwnMessage ? 'row' : 'row-reverse' }}
      grow
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group
        gap="xs"
        justify={isOwnMessage ? 'flex-start' : 'flex-end'}
        style={{
          opacity: isHovered || isEditing ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {canWrite && (
          <ActionIcon
            variant="subtle"
            aria-label="reply"
            onClick={onReplyMessage}
          >
            <Reply size={20} />
          </ActionIcon>
        )}
        {canEditMessage && (
          <Menu position="bottom-start" shadow="md" width={150} offset={-30}>
            <Menu.Target>
              <ActionIcon variant="subtle" aria-label="edit" onClick={() => {}}>
                <EllipsisVertical size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {MessageActions && (
                <MessageActions
                  setIsEditing={setIsEditing}
                  setEditedContent={setEditedContent}
                  messageContent={content}
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
            <Text fw={500} style={messageItemStyles.breakText()}>
              {userName}
            </Text>
            <Text size="xs">{formatDateTime(time)}</Text>
            {modifiedAt && (
              <Text size="xs" fs="italic">
                (изменено)
              </Text>
            )}
          </Group>
          <Box style={messageItemStyles.box(isOwnMessage, isEditing, isTagged)}>
            {replyMessage && (
              <Notification
                title={
                  <Group gap="xs">
                    <Reply size={10} />
                    <Text size="sm">{getUsername(replyMessage.authorId)}</Text>
                  </Group>
                }
                withCloseButton={false}
              >
                {replyMessage.text}
              </Notification>
            )}
            {isEditing && EditMessage ? (
              <EditMessage
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                setIsEditing={setIsEditing}
              />
            ) : (
              <Text
                style={messageItemStyles.breakText()}
                dangerouslySetInnerHTML={{
                  __html: content ? formatMessage(content) : '',
                }}
              />
            )}
            {files && files.length > 0 && (
              <MessageFiles files={files} channelId={channelId} />
            )}
            {nestedChannel && nestedChannel.canUse && (
              <Button
                radius="md"
                variant="default"
                color="gray"
                onClick={() => handleOpenSubChat(nestedChannel?.subChannelId)}
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
