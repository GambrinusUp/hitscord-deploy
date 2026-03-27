import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  Notification,
  Portal,
  Stack,
  Text,
} from '@mantine/core';
import { EllipsisVertical, Plus, Reply, SmilePlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { messageItemStyles } from './MessageItem.style';
import { MessageFiles } from './NewMessageFiles';

import { formatMessage } from '~/entities/message/lib/formatMessage';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import {
  EmojiInfo,
  MessageItemProps,
  MessageType,
} from '~/entities/message/model/types';
import { setCurrentSubChatId, setSubChatInfo } from '~/entities/subChat';
import { formatDateTime } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';
import { EmojiPicker } from '~/shared/ui';
import { useChannelPermissions } from '~/widgets/messagesList/lib/useChannelPermissions';

export const MessageItem = ({
  messageId,
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
  reactions,
}: MessageItemProps) => {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { serverData, currentChannelId, currentNotificationChannelId } =
    useAppSelector((state) => state.testServerStore);
  const activeChannelId = currentChannelId ?? currentNotificationChannelId;
  const canDeleteOthersMessages =
    serverData.permissions.canDeleteOthersMessages;
  const canEditMessage =
    isOwnMessage || (activeChannelId && canDeleteOthersMessages);
  const isChat = type === MessageType.CHAT;
  const userId = user.id;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const menuDropdownRef = useRef<HTMLDivElement | null>(null);
  const pickerContainerRef = useRef<HTMLDivElement | null>(null);
  const reactionMenuDropdownRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [reactionMenuOpened, setReactionMenuOpened] = useState(false);
  const [selectedReactionEmoji, setSelectedReactionEmoji] = useState<
    string | null
  >(null);
  const [menuAnchor, setMenuAnchor] = useState<'edge' | 'cursor'>('edge');
  const [pickerAnchor, setPickerAnchor] = useState<'edge' | 'cursor'>('cursor');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [reactionMenuPosition, setReactionMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [menuPositionClamped, setMenuPositionClamped] = useState({
    x: 0,
    y: 0,
  });
  const [reactionMenuPositionClamped, setReactionMenuPositionClamped] =
    useState({
      x: 0,
      y: 0,
    });
  const [pickerPositionClamped, setPickerPositionClamped] = useState({
    x: 0,
    y: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const { addReaction, removeReaction } = useWebSocket();
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { canWrite } = useChannelPermissions();
  const [emojiMap, setEmojiMap] = useState<Map<string, EmojiInfo>>(new Map());

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

  const getChannelId = () => {
    switch (type) {
      case MessageType.CHANNEL:
        return activeChannelId!;
      case MessageType.CHAT:
        return activeChat!;
      case MessageType.SUBCHAT:
        return currentSubChatId!;
    }
  };

  const handleAddReaction = (emoji: string) => {
    const existingEmoji = emojiMap.get(emoji);

    if (!existingEmoji || (existingEmoji && !existingEmoji.isAuthor)) {
      addReaction(
        {
          ChannelId: getChannelId(),
          MessageId: messageId,
          ReactionCode: emoji,
          Token: accessToken,
        },
        isChat ? 'chat' : 'channel',
      );
    }
  };

  const handleReactionClick = (
    emojiId: string | null,
    isAuthor: boolean,
    emoji: string,
  ) => {
    if (isAuthor) {
      removeReaction(
        {
          ChannelId: getChannelId(),
          ReactionId: emojiId!,
          Token: accessToken,
        },
        isChat ? 'chat' : 'channel',
      );
    } else {
      addReaction(
        {
          ChannelId: getChannelId(),
          MessageId: messageId,
          ReactionCode: emoji,
          Token: accessToken,
        },
        isChat ? 'chat' : 'channel',
      );
    }
  };

  useEffect(() => {
    const clampToViewport = (
      x: number,
      y: number,
      width: number,
      height: number,
      alignRight = false,
      padding = 8,
    ) => {
      const maxX = Math.max(
        padding,
        alignRight
          ? window.innerWidth - padding
          : window.innerWidth - width - padding,
      );
      const minX = Math.max(padding, alignRight ? width + padding : padding);
      const maxY = Math.max(padding, window.innerHeight - height - padding);

      return {
        x: Math.min(Math.max(x, minX), maxX),
        y: Math.min(Math.max(y, padding), maxY),
      };
    };

    const updateMenuPosition = () => {
      if (!menuOpened || !menuDropdownRef.current) return;
      const rect = menuDropdownRef.current.getBoundingClientRect();
      const alignRight = !isOwnMessage && menuAnchor === 'edge';
      const next = clampToViewport(
        menuPosition.x,
        menuPosition.y,
        rect.width,
        rect.height,
        alignRight,
      );
      setMenuPositionClamped(next);
    };

    const updatePickerPosition = () => {
      if (!showEmojiPicker || !pickerContainerRef.current) return;
      const rect = pickerContainerRef.current.getBoundingClientRect();
      const alignRight = !isOwnMessage && pickerAnchor === 'edge';
      const next = clampToViewport(
        menuPosition.x,
        menuPosition.y + 40,
        rect.width,
        rect.height,
        alignRight,
      );
      setPickerPositionClamped(next);
    };

    const updateReactionMenuPosition = () => {
      if (!reactionMenuOpened || !reactionMenuDropdownRef.current) return;
      const rect = reactionMenuDropdownRef.current.getBoundingClientRect();
      const next = clampToViewport(
        reactionMenuPosition.x,
        reactionMenuPosition.y,
        rect.width,
        rect.height,
        false,
      );
      setReactionMenuPositionClamped(next);
    };

    const updateAll = () => {
      updateMenuPosition();
      updatePickerPosition();
      updateReactionMenuPosition();
    };

    if (menuOpened || showEmojiPicker || reactionMenuOpened) {
      requestAnimationFrame(updateAll);
      const handler = () => requestAnimationFrame(updateAll);
      window.addEventListener('resize', handler);
      window.addEventListener('scroll', handler, true);

      return () => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('scroll', handler, true);
      };
    }
  }, [
    menuOpened,
    showEmojiPicker,
    reactionMenuOpened,
    menuPosition.x,
    menuPosition.y,
    reactionMenuPosition.x,
    reactionMenuPosition.y,
    isOwnMessage,
    menuAnchor,
    pickerAnchor,
  ]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current) return;

      if (!pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      window.addEventListener('mousedown', handler);
    }

    return () => {
      window.removeEventListener('mousedown', handler);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!reactionMenuDropdownRef.current) return;

      if (
        !reactionMenuDropdownRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-reaction-menu-trigger]')
      ) {
        setReactionMenuOpened(false);
      }
    };

    if (reactionMenuOpened) {
      window.addEventListener('mousedown', handler);
    }

    return () => {
      window.removeEventListener('mousedown', handler);
    };
  }, [reactionMenuOpened]);

  useEffect(() => {
    const newEmojiMap = new Map<string, EmojiInfo>();

    reactions.forEach((reaction) => {
      const existing = newEmojiMap.get(reaction.reactionCode);

      if (existing) {
        newEmojiMap.set(reaction.reactionCode, {
          count: existing.count + 1,
          isAuthor: existing.isAuthor || reaction.authorId === userId,
          reactionId:
            reaction.authorId === userId ? reaction.id : existing.reactionId,
        });
      } else {
        newEmojiMap.set(reaction.reactionCode, {
          count: 1,
          isAuthor: reaction.authorId === userId,
          reactionId: reaction.authorId === userId ? reaction.id : null,
        });
      }
    });

    setEmojiMap(newEmojiMap);
  }, [reactions, userId]);

  return (
    <>
      <Group
        ref={containerRef}
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
        onContextMenu={(e) => {
          e.preventDefault();

          setMenuAnchor('cursor');
          const next = { x: e.clientX, y: e.clientY };
          setMenuPosition(next);
          setMenuPositionClamped(next);
          setMenuOpened(true);
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
                e.currentTarget.style.backgroundColor =
                  'var(--color-primary-10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Reply size={18} />
            </ActionIcon>
          )}
          <Menu
            opened={menuOpened}
            onChange={setMenuOpened}
            position="bottom-start"
            shadow="md"
            width={150}
          >
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                aria-label="edit"
                onClick={() => {
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();

                    setMenuAnchor('edge');
                    const next = {
                      x: isOwnMessage ? rect.left : rect.right,
                      y: rect.top,
                    };
                    setMenuPosition(next);
                    setMenuPositionClamped(next);
                  }

                  setMenuOpened((o) => !o);
                }}
                style={messageItemStyles.actionButtons()}
              >
                <EllipsisVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown
              ref={menuDropdownRef}
              style={{
                position: 'fixed',
                top: menuPositionClamped.y,
                left: menuPositionClamped.x,
                transform:
                  !isOwnMessage && menuAnchor === 'edge'
                    ? 'translateX(-100%)'
                    : 'none',
              }}
            >
              {canEditMessage && MessageActions && (
                <MessageActions
                  onEdit={() => onEditMessage?.()}
                  isOwnMessage={isOwnMessage}
                />
              )}
              <Menu.Item
                leftSection={<SmilePlus size={12} />}
                onClick={() => {
                  const nextAnchor =
                    menuAnchor === 'cursor' ? 'cursor' : 'edge';
                  setPickerAnchor(nextAnchor);
                  setPickerPositionClamped({
                    x: menuPosition.x,
                    y: menuPosition.y + 40,
                  });
                  setShowEmojiPicker((v) => !v);
                }}
              >
                Добавить реакцию
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
                    e.currentTarget.style.boxShadow =
                      '0 4px 8px rgba(0, 0, 0, 0.2)';
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
            <Group
              flex={1}
              align="center"
              style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
              gap={4}
            >
              {reactions.length > 0 && (
                <ActionIcon
                  variant="light"
                  color="gray"
                  radius="xl"
                  size={28}
                  style={{
                    height: 28,
                    width: 28,
                    minWidth: 28,
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setPickerAnchor('cursor');
                    const next = { x: e.clientX - 40, y: e.clientY - 20 };
                    setMenuPosition(next);
                    setPickerPositionClamped({
                      x: next.x,
                      y: next.y + 40,
                    });
                    setShowEmojiPicker((v) => !v);
                  }}
                >
                  <Plus size={16} />
                </ActionIcon>
              )}
              {Array.from(emojiMap.entries()).map(
                ([emoji, { count, reactionId, isAuthor }]) => (
                  <Button
                    key={emoji}
                    variant={isAuthor ? 'light' : 'subtle'}
                    color={isAuthor ? 'blue' : 'gray'}
                    radius="xl"
                    size="xs"
                    px={8}
                    data-reaction-menu-trigger
                    style={{
                      height: 28,
                      minHeight: 28,
                      fontSize: 12,
                      fontWeight: 500,
                      minWidth: 36,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        zIndex: 1,
                      },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() =>
                      handleReactionClick(reactionId, isAuthor, emoji)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedReactionEmoji(emoji);
                      const next = { x: e.clientX, y: e.clientY };
                      setReactionMenuPosition(next);
                      setReactionMenuPositionClamped(next);
                      setReactionMenuOpened(true);
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>{emoji}</span>
                      {count > 0 && <span>{count}</span>}
                    </div>
                  </Button>
                ),
              )}
            </Group>
          </Stack>
        </Group>
      </Group>
      {showEmojiPicker && (
        <Portal>
          <div
            ref={pickerRef}
            style={{
              position: 'fixed',
              top: pickerPositionClamped.y,
              left: pickerPositionClamped.x,
              transform:
                !isOwnMessage && pickerAnchor === 'edge'
                  ? 'translateX(-100%)'
                  : 'none',
              zIndex: 1000,
            }}
          >
            <div ref={pickerContainerRef}>
              <EmojiPicker
                onSelect={(emoji) => {
                  handleAddReaction(emoji);
                  setShowEmojiPicker(false);
                  setMenuOpened(false);
                }}
              />
            </div>
          </div>
        </Portal>
      )}
      {reactionMenuOpened && selectedReactionEmoji && (
        <Portal>
          <Menu opened={reactionMenuOpened} onChange={setReactionMenuOpened}>
            <Menu.Dropdown
              ref={reactionMenuDropdownRef}
              style={{
                position: 'fixed',
                top: reactionMenuPositionClamped.y,
                left: reactionMenuPositionClamped.x,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {reactions
                .filter(
                  (reaction) => reaction.reactionCode === selectedReactionEmoji,
                )
                .map((reaction) => (
                  <Menu.Item
                    key={reaction.id}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    style={{ cursor: 'default', pointerEvents: 'none' }}
                  >
                    {getUsername(reaction.authorId)}
                  </Menu.Item>
                ))}
            </Menu.Dropdown>
          </Menu>
        </Portal>
      )}
    </>
  );
};
