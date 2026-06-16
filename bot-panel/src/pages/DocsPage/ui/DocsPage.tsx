import {
  AppShell,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  List,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DOCS_TOPICS } from '~/entities/docs';
import { AppHeader } from '~/widgets';
import { DocsSidebar } from '~/widgets/docs';

const CodeBlock = ({ code }: { code: string }) => (
  <Box
    component="pre"
    p="md"
    style={{
      overflowX: 'auto',
      borderRadius: 8,
      backgroundColor: 'var(--mantine-color-default)',
      border: '1px solid var(--mantine-color-default-border)',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.45,
      margin: 0,
    }}
  >
    <code>{code}</code>
  </Box>
);

export const DocsPage = () => {
  const [opened, { close, toggle }] = useDisclosure();
  const [activeTopicId, setActiveTopicId] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTopic = useCallback(
    (topicId: string, behavior: ScrollBehavior = 'smooth') => {
      const section = document.getElementById(topicId);

      if (!section) return;

      section.scrollIntoView({ behavior, block: 'start' });
      setActiveTopicId(topicId);

      navigate(
        {
          pathname: '/docs',
          search: `?topic=${topicId}`,
        },
        { replace: true },
      );
      close();
    },
    [close, navigate],
  );

  useEffect(() => {
    const topicFromUrl = new URLSearchParams(location.search).get('topic');

    if (!topicFromUrl) return;

    const exists = DOCS_TOPICS.some((topic) => topic.id === topicFromUrl);

    if (!exists) return;

    const section = document.getElementById(topicFromUrl);

    if (!section) return;

    section.scrollIntoView({ behavior: 'auto', block: 'start' });
    setActiveTopicId(topicFromUrl);
  }, [location.search]);

  useEffect(() => {
    const sections = DOCS_TOPICS.map((topic) => document.getElementById(topic.id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const current = visible[0];

        if (!current?.target.id) return;

        setActiveTopicId(current.target.id);
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '-80px 0px -55% 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 320,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppHeader opened={opened} toggle={toggle} showMenuButton />
      <AppShell.Navbar p="md">
        <DocsSidebar
          topics={DOCS_TOPICS}
          activeTopicId={activeTopicId}
          onSelectTopic={scrollToTopic}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl" py="xl">
              <Stack gap="xl">
                <Stack gap="sm">
                  <Badge variant="light" w="fit-content">
                    Hitscord Bot SDK
                  </Badge>
                  <Title order={1}>Полная документация SDK</Title>
                </Stack>

                <Stack id="overview" gap="md">
                  <Title order={2}>1. Что такое SDK</Title>
                  <Text>
                    <code>Hitscord Bot SDK</code> — TypeScript/Node.js SDK для создания ботов, которые:
                  </Text>
                  <List>
                    <List.Item>подключаются к BotAPI через socket.io;</List.Item>
                    <List.Item>слушают сообщения, реакции и события пользователей;</List.Item>
                    <List.Item>обрабатывают slash-команды;</List.Item>
                    <List.Item>отправляют, редактируют и удаляют сообщения;</List.Item>
                    <List.Item>управляют ролями и каналами (при наличии прав);</List.Item>
                    <List.Item>подключаются к голосовым каналам и получают медиапотоки.</List.Item>
                  </List>
                  <Text>
                    Основной класс SDK: <code>BotClient</code>.
                  </Text>
                </Stack>

                <Divider />

                <Stack id="quick-start" gap="md">
                  <Title order={2}>2. Быстрый старт</Title>
                  <CodeBlock
                    code={`import { BotClient } from '@hitscord/bot-sdk';

const bot = new BotClient({
  apiUrl: process.env.API_URL ?? 'http://localhost:3001',
  token: process.env.BOT_TOKEN ?? '',
  mediaServerUrl: process.env.MEDIA_SERVER_URL,
  mediaRejectUnauthorized: false,
});

async function main() {
  await bot.connect();

  bot.commands.register('ping', async (ctx) => {
    await ctx.reply('Pong!');
  });

  bot.on('messageCreate', (message) => {
    console.log('Новое сообщение:', message.text);
  });
}

void main();`}
                  />
                  <Text c="dimmed">Если SDK используется напрямую из репозитория:</Text>
                  <CodeBlock code={`import { BotClient } from '../src/sdk/bot-client.js';`} />
                </Stack>

                <Divider />

                <Stack id="bot-client" gap="md">
                  <Title order={2}>3. Инициализация BotClient</Title>
                  <Text>Конструктор:</Text>
                  <CodeBlock
                    code={`new BotClient({
  apiUrl: string;
  token: string;
  mediaServerUrl?: string;
  mediaRejectUnauthorized?: boolean;
  commandPrefix?: string;
  enableEarlyPermissionCheck?: boolean;
})`}
                  />
                  <Text>Параметры:</Text>
                  <List>
                    <List.Item>
                      <code>apiUrl</code> — адрес BotAPI, например <code>http://localhost:3001</code>.
                    </List.Item>
                    <List.Item>
                      <code>token</code> — bot API key, передается как <code>X-Bot-Token</code>.
                    </List.Item>
                    <List.Item>
                      <code>mediaServerUrl</code> — адрес media signaling (по умолчанию равен
                      <code>apiUrl</code>).
                    </List.Item>
                    <List.Item>
                      <code>mediaRejectUnauthorized</code> — проверка TLS-сертификата в voice socket
                      (<code>true</code> по умолчанию).
                    </List.Item>
                    <List.Item>
                      <code>commandPrefix</code> — есть в опциях, но не применяется автоматически.
                      Используйте <code>bot.commands.setPrefix()</code>.
                    </List.Item>
                    <List.Item>
                      <code>enableEarlyPermissionCheck</code> — валидирует права до отправки команды.
                    </List.Item>
                  </List>
                </Stack>

                <Divider />

                <Stack id="lifecycle" gap="md">
                  <Title order={2}>4. Подключение и жизненный цикл</Title>
                  <List>
                    <List.Item>
                      <code>await bot.connect()</code> — подключает namespace <code>/bot</code>,
                      делает auth и инициализирует менеджеры.
                    </List.Item>
                    <List.Item>
                      <code>bot.disconnect()</code> — закрытие voice-сессий и socket.
                    </List.Item>
                    <List.Item>
                      <code>bot.isAuth()</code> — текущий статус авторизации.
                    </List.Item>
                    <List.Item>
                      <code>await bot.waitForConnection(timeoutMs)</code> — ожидание подключения.
                    </List.Item>
                  </List>
                </Stack>

                <Divider />

                <Stack id="permissions" gap="md">
                  <Title order={2}>5. Данные бота и права</Title>
                  <List>
                    <List.Item>
                      <code>bot.getBotId()</code>, <code>bot.getAccountTag()</code>,{' '}
                      <code>bot.getPermissions()</code>, <code>bot.hasPermission(permission)</code>
                    </List.Item>
                  </List>
                  <CodeBlock
                    code={`if (!bot.hasPermission('SEND_MESSAGES')) {
  console.warn('У бота нет SEND_MESSAGES');
}`}
                  />
                  <Text>BotPermissions:</Text>
                  <CodeBlock
                    code={`interface BotPermissions {
  MANAGE_ROLES?: boolean;
  MANAGE_CHANNELS?: boolean;
  SEND_MESSAGES?: boolean;
  READ_MESSAGES?: boolean;
  ATTACH_FILES?: boolean;
  JOIN_VOICE?: boolean;
  RECORD_AUDIO?: boolean;
  STREAM_SCREEN?: boolean;
  MUTE_MEMBERS?: boolean;
  KICK_MEMBERS?: boolean;
  CREATE_LESSON?: boolean;
  CHECK_ATTENDANCE?: boolean;
  NOTIFY_CHANNEL?: boolean;
}`}
                  />
                </Stack>

                <Divider />

                <Stack id="events" gap="md">
                  <Title order={2}>6. События BotClient</Title>
                  <Text>Подписка стандартная:</Text>
                  <CodeBlock code={`bot.on('messageCreate', (message) => {});`} />
                  <Text>События сообщений и чатов:</Text>
                  <List>
                    <List.Item>
                      <code>messageCreate</code> — входящее сообщение в серверном канале.
                    </List.Item>
                    <List.Item>
                      <code>message</code> — входящее НЕ-командное серверное сообщение.
                    </List.Item>
                    <List.Item>
                      <code>chatMessageCreate</code> — входящее сообщение в личном чате.
                    </List.Item>
                    <List.Item>
                      <code>chatMessage</code> — синоним для chat-сообщений.
                    </List.Item>
                  </List>
                  <Text>События реакций и пользователей:</Text>
                  <List>
                    <List.Item>
                      <code>reactionAdded</code> — реакция добавлена.
                    </List.Item>
                    <List.Item>
                      <code>reactionRemoved</code> — реакция удалена.
                    </List.Item>
                    <List.Item>
                      <code>serverUserConnected</code> — пользователь подключился к серверу.
                    </List.Item>
                  </List>
                  <Text>Форматы событий:</Text>
                  <CodeBlock
                    code={`interface BotMessage {
  messageId: number;
  serverId: string;
  channelId: string;
  chatId?: string;
  contextType?: 'server' | 'chat';
  userId: string;
  text: string;
  botName?: string;
}

interface BotReactionEvent {
  reactionId?: string;
  serverId?: string;
  channelId: string;
  messageId: number;
  authorId?: string;
  reactionCode: string;
  createdAt?: string | Date;
}

interface BotServerUserConnectedEvent {
  serverId: string;
  userId: string;
  userTag?: string;
  userName?: string;
  userServerName?: string;
  joinedAt?: string | Date;
}`}
                  />
                </Stack>

                <Divider />

                <Stack id="commands" gap="md">
                  <Title order={2}>7. Команды: bot.commands</Title>
                  <Text>Методы:</Text>
                  <List>
                    <List.Item>
                      <code>register</code>, <code>getAll</code>, <code>has</code>,{' '}
                      <code>remove</code>, <code>getPrefix</code>, <code>setPrefix</code>,{' '}
                      <code>isCommand</code>
                    </List.Item>
                  </List>
                  <Text>Обработчик команды:</Text>
                  <CodeBlock
                    code={`bot.commands.register('echo', async (ctx) => {
  const text = ctx.getArgs().join(' ');
  await ctx.reply(text || 'Пустой аргумент');
});`}
                  />
                </Stack>

                <Divider />

                <Stack id="command-context" gap="md">
                  <Title order={2}>8. Контекст команды: CommandContext</Title>
                  <Text>Чтение входных данных:</Text>
                  <List>
                    <List.Item>
                      Чтение: <code>getArgs</code>, <code>getArg</code>, <code>getMessage</code>,{' '}
                      <code>getUserId</code>, <code>getChannelId</code>, <code>getServerId</code>
                    </List.Item>
                  </List>
                  <Text>Действия:</Text>
                  <List>
                    <List.Item>
                      <code>reply</code>, <code>edit</code>, <code>react</code>, <code>unreact</code>,{' '}
                      <code>unreactByCode</code>
                    </List.Item>
                  </List>
                </Stack>

                <Divider />

                <Stack id="command-events" gap="md">
                  <Title order={2}>9. События CommandManager</Title>
                  <Text>
                    Эти события эмитятся менеджером команд. Подписывайтесь на{' '}
                    <code>bot.commands.on(...)</code>.
                  </Text>
                  <CodeBlock
                    code={`bot.commands.on('commandExecuted', ({ commandName, args, message }) => {
  console.log(commandName, args, message.userId);
});`}
                  />
                  <Text>Доступные события:</Text>
                  <List>
                    <List.Item>
                      <code>commandExecuted</code>, <code>commandNotFound</code>,{' '}
                      <code>commandError</code>
                    </List.Item>
                  </List>
                </Stack>

                <Divider />

                <Stack id="messages" gap="md">
                  <Title order={2}>10. Сообщения: bot.messages</Title>
                  <Text>Методы:</Text>
                  <List>
                    <List.Item>
                      <code>send</code>, <code>sendWithMentions</code>, <code>edit</code>,{' '}
                      <code>delete</code>, <code>addReaction</code>, <code>removeReaction</code>,{' '}
                      <code>removeReactionByCode</code>, <code>toggleReaction</code>
                    </List.Item>
                  </List>
                  <Text>Пример:</Text>
                  <CodeBlock
                    code={`await bot.messages.send(serverId, channelId, 'Всем привет');
await bot.messages.sendWithMentions(serverId, channelId, 'Проверьте апдейт', {
  userTags: ['User#123456'],
  roleIds: ['role-id'],
});`}
                  />
                </Stack>

                <Divider />

                <Stack id="chats" gap="md">
                  <Title order={2}>11. Личные чаты: bot.chats</Title>
                  <List>
                    <List.Item>
                      <code>send(chatId, text)</code>, <code>edit</code>, <code>delete</code>
                    </List.Item>
                  </List>
                  <CodeBlock code={`await bot.chats.send(chatId, 'Привет из бота');`} />
                </Stack>

                <Divider />

                <Stack id="servers" gap="md">
                  <Title order={2}>12. Серверы: bot.servers</Title>
                  <Text>Чтение данных:</Text>
                  <List>
                    <List.Item>
                      Чтение: <code>getUsers</code>, <code>getData</code>, <code>getRoles</code>
                    </List.Item>
                  </List>
                  <Text>Роли:</Text>
                  <List>
                    <List.Item>
                      <code>addUserRole</code>, <code>removeUserRole</code>, <code>createRole</code>,{' '}
                      <code>updateRole</code>, <code>deleteRole</code>,{' '}
                      <code>updateRoleSettings</code>
                    </List.Item>
                  </List>
                  <Text>Модерация:</Text>
                  <List>
                    <List.Item>
                      <code>getBannedUsers</code>, <code>banUser</code>, <code>unbanUser</code>
                    </List.Item>
                  </List>
                  <Text>ServerRoleSetting:</Text>
                  <CodeBlock
                    code={`enum ServerRoleSetting {
  CanChangeRole = 0,
  CanWorkChannels = 1,
  CanDeleteUsers = 2,
  CanMuteOther = 3,
  CanDeleteOthersMessages = 4,
  CanIgnoreMaxCount = 5,
  CanCreateRole = 6,
  CanCreateLessons = 7,
  CanCheckAttendance = 8,
  CanUseInvitations = 9,
}`}
                  />
                </Stack>

                <Divider />

                <Stack id="channels" gap="md">
                  <Title order={2}>13. Каналы: bot.channels</Title>
                  <Text>Методы:</Text>
                  <List>
                    <List.Item>
                      <code>getChannels</code>, <code>createChannel</code>, <code>updateChannel</code>,{' '}
                      <code>deleteChannel</code>, <code>getChannelSettings</code>,{' '}
                      <code>changeChannelName</code>, <code>changeChannelSettings</code>
                    </List.Item>
                  </List>
                  <Text>Типы каналов:</Text>
                  <CodeBlock
                    code={`enum ChannelType {
  Text = 'Text',
  Voice = 'Voice',
  Notification = 'Notification',
  Pair = 'Pair',
}`}
                  />
                </Stack>

                <Divider />

                <Stack id="voice" gap="md">
                  <Title order={2}>14. Голос и медиа: bot.voice</Title>
                  <Text>Основные методы:</Text>
                  <List>
                    <List.Item>
                      <code>connect</code>, <code>joinVoiceChannel</code>,{' '}
                      <code>createConsumerTransport</code>, <code>connectConsumerTransport</code>,{' '}
                      <code>getProducers</code>, <code>consume</code>, <code>resumeConsumer</code>,{' '}
                      <code>leaveVoiceChannel</code>, <code>disconnect</code>
                    </List.Item>
                  </List>
                  <Text>События VoiceManager:</Text>
                  <List>
                    <List.Item>
                      <code>connected</code>, <code>disconnected</code>, <code>connectionSuccess</code>,{' '}
                      <code>newProducer</code>, <code>producerAdded</code>, <code>producerClosed</code>,{' '}
                      <code>activeSpeakers</code>, <code>kicked</code>,{' '}
                      <code>kickedByNewBotSession</code>, <code>leaveConfirmed</code>,{' '}
                      <code>leaveError</code>, <code>mediaStream</code>, <code>error</code>
                    </List.Item>
                  </List>
                  <Text>Удобные подписки с фильтрами:</Text>
                  <List>
                    <List.Item>
                      <code>onProducerAdded(handler, filter?)</code>,{' '}
                      <code>onMediaStream(handler, filter?)</code>
                    </List.Item>
                  </List>
                  <CodeBlock
                    code={`interface MediaEventFilter {
  producerIds?: string[];
  userIds?: string[];
  kinds?: string[];
  sources?: Array<'screen-video' | 'screen-audio' | 'microphone' | 'camera'>;
  userNames?: string[];
}`}
                  />
                </Stack>

                <Divider />

                <Stack id="voice-pool" gap="md">
                  <Title order={2}>15. Пул голосовых сессий: bot.voicePool</Title>
                  <Text>Методы:</Text>
                  <List>
                    <List.Item>
                      <code>joinVoiceChannel</code>, <code>getSession</code>,{' '}
                      <code>getActiveServers</code>, <code>leaveServer</code>, <code>disconnectAll</code>
                    </List.Item>
                  </List>
                  <Text>События VoicePoolManager:</Text>
                  <List>
                    <List.Item>
                      <code>sessionJoined</code>, <code>sessionLeft</code>, <code>newProducer</code>,{' '}
                      <code>producerAdded</code>, <code>mediaStream</code>,{' '}
                      <code>producerClosed</code>, <code>activeSpeakers</code>,{' '}
                      <code>kickedByNewBotSession</code>, <code>error</code>
                    </List.Item>
                  </List>
                </Stack>

                <Divider />

                <Stack id="examples" gap="md">
                  <Title order={2}>16. Полноценные примеры</Title>
                  <Text>Пример A: команды и логирование</Text>
                  <CodeBlock
                    code={`const bot = new BotClient({ apiUrl, token });

bot.commands.setPrefix('/');

bot.commands.on('commandNotFound', ({ commandName }) => {
  console.warn('Неизвестная команда:', commandName);
});

bot.commands.register('help', async (ctx) => {
  const list = bot.commands.getAll().map((c) => \`/\${c}\`).join('\n');
  await ctx.reply(\`Доступные команды:\\n\${list}\`);
});`}
                  />
                  <Text>Пример B: управление каналами</Text>
                  <CodeBlock
                    code={`import { ChannelType } from '@hitscord/bot-sdk';

bot.commands.register('create-text', async (ctx) => {
  const name = ctx.getArgs().join(' ') || 'new-channel';
  const result = await bot.channels.createChannel(
    ctx.getServerId(),
    name,
    ChannelType.Text,
  );

  await ctx.reply(result.success ? 'Канал создан' : \`Ошибка: \${result.error}\`);
});`}
                  />
                  <Text>Пример C: удаление запрещенных сообщений</Text>
                  <CodeBlock
                    code={`const banned = ['spam', 'badword'];

bot.on('messageCreate', async (message) => {
  if (message.text.startsWith('/')) return;
  const lowered = message.text.toLowerCase();
  if (!banned.some((w) => lowered.includes(w))) return;

  await bot.messages.delete(message.channelId, message.messageId);
  await bot.messages.send(
    message.serverId,
    message.channelId,
    \`Сообщение пользователя \${message.userId} удалено модератором.\`,
  );
});`}
                  />
                  <Text>Пример D: прием медиапотоков</Text>
                  <CodeBlock
                    code={`await bot.voicePool.joinVoiceChannel({
  serverId,
  voiceChannelId,
});

const voice = bot.voicePool.getSession(serverId);
if (!voice) throw new Error('Voice session missing');

voice.onProducerAdded((event) => {
  console.log('Producer:', event.producerId, event.source);
});

voice.onMediaStream((event) => {
  console.log('Media:', event.kind, event.userName, event.source);
});`}
                  />
                </Stack>

                <Divider />

                <Stack id="errors" gap="md">
                  <Title order={2}>17. Ошибки и edge-cases</Title>
                  <List>
                    <List.Item>Почти все методы завязаны на socket ack, используйте try/catch.</List.Item>
                    <List.Item>После разрыва проверяйте <code>bot.isAuth()</code>.</List.Item>
                    <List.Item>
                      Учитывайте ошибки прав: <code>Bot does not have required permission: ...</code>
                    </List.Item>
                    <List.Item>
                      Методы сообщений и серверов бросают <code>Socket not connected</code> при отсутствии
                      подключения.
                    </List.Item>
                  </List>
                  <Text>Рекомендуемый шаблон:</Text>
                  <CodeBlock
                    code={`try {
  const res = await bot.messages.send(serverId, channelId, 'OK');
  if (!res.success) {
    console.error('API error:', res.error);
  }
} catch (e) {
  console.error('Transport error:', e);
}`}
                  />
                </Stack>

                <Divider />

                <Button variant="subtle" onClick={() => scrollToTopic('overview')} w="fit-content">
                  Наверх
                </Button>
              </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
