# Hitscord Bot SDK — полная документация

Документ основан на текущей реализации SDK в [bot-api/src/sdk](bot-api/src/sdk) и примерах из [bot-api/examples](bot-api/examples).

## 1. Что такое SDK

Hitscord Bot SDK — TypeScript/Node.js SDK для создания ботов, которые:

- подключаются к BotAPI через socket.io;
- слушают сообщения, реакции и события пользователей;
- обрабатывают slash-команды;
- отправляют/редактируют/удаляют сообщения;
- управляют ролями и каналами (при наличии прав);
- подключаются к голосовым каналам и получают медиапотоки через mediasoup.

Основной класс SDK: `BotClient`.

## 2. Быстрый старт

```ts
import { BotClient } from '@hitscord/bot-sdk';

const bot = new BotClient({
  apiUrl: process.env.API_URL ?? 'http://localhost:3001',
  token: process.env.BOT_TOKEN ?? '',
  mediaServerUrl: process.env.MEDIA_SERVER_URL, // опционально
  mediaRejectUnauthorized: false, // удобно для self-signed TLS
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

void main();
```

Если SDK используется напрямую из репозитория, импорт может выглядеть так:

```ts
import { BotClient } from '../src/sdk/bot-client.js';
```

## 3. Инициализация `BotClient`

### Конструктор

```ts
new BotClient({
  apiUrl: string;
  token: string;
  mediaServerUrl?: string;
  mediaRejectUnauthorized?: boolean;
  commandPrefix?: string;
  enableEarlyPermissionCheck?: boolean;
})
```

### Параметры

- `apiUrl` — адрес BotAPI (например, `http://localhost:3001`).
- `token` — bot API key (передается как `X-Bot-Token`).
- `mediaServerUrl` — адрес media signaling (по умолчанию равен `apiUrl`).
- `mediaRejectUnauthorized` — проверка TLS-сертификата в voice socket (`true` по умолчанию).
- `commandPrefix` — есть в опциях, но **не применяется автоматически**; используйте `bot.commands.setPrefix()`.
- `enableEarlyPermissionCheck` — при `true` часть методов валидирует права до отправки команды на сервер.

## 4. Подключение и жизненный цикл

### `await bot.connect(): Promise<void>`

- подключает namespace `/bot`;
- отправляет `auth`;
- ожидает `authenticated`;
- инициализирует менеджеры: `messages`, `chats`, `servers`, `channels`, `commands`, `voice`, `voicePool`.

### `bot.disconnect(): void`

- закрывает голосовые сессии (`voicePool.disconnectAll()`, `voice.disconnect()`);
- разрывает socket-соединение с BotAPI.

### `bot.isAuth(): boolean`

Текущее состояние аутентификации.

### `await bot.waitForConnection(timeoutMs = 30000): Promise<void>`

Ожидает успешной аутентификации или бросает ошибку по таймауту.

## 5. Данные бота и права

- `bot.getBotId(): string`
- `bot.getAccountTag(): string`
- `bot.getPermissions(): BotPermissions`
- `bot.hasPermission(permission): boolean`

```ts
if (!bot.hasPermission('SEND_MESSAGES')) {
  console.warn('У бота нет SEND_MESSAGES');
}
```

### `BotPermissions`

```ts
interface BotPermissions {
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
}
```

## 6. События `BotClient`

Подписка стандартная:

```ts
bot.on('messageCreate', (message) => {});
```

### События сообщений и чатов

- `messageCreate` — входящее сообщение в серверном канале.
- `message` — входящее НЕ-командное серверное сообщение.
- `chatMessageCreate` — входящее сообщение в личном чате.
- `chatMessage` — синоним для chat-сообщений.

### События реакций и пользователей

- `reactionAdded` — реакция добавлена.
- `reactionRemoved` — реакция удалена.
- `serverUserConnected` — пользователь подключился к серверу.

### Форматы событий

```ts
interface BotMessage {
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
}
```

## 7. Команды: `bot.commands`

`CommandManager` отвечает за регистрацию и выполнение slash-команд.

### Методы

- `register(name, handler)` — регистрация команды.
- `getAll()` — список команд.
- `has(name)` — проверка регистрации.
- `remove(name)` — удалить команду.
- `getPrefix()` — текущий префикс (по умолчанию `/`).
- `setPrefix(prefix)` — установить префикс.
- `isCommand(text)` — проверить, является ли строка командой.

### Обработчик команды

```ts
bot.commands.register('echo', async (ctx) => {
  const text = ctx.getArgs().join(' ');
  await ctx.reply(text || 'Пустой аргумент');
});
```

## 8. Контекст команды: `CommandContext`

### Чтение входных данных

- `ctx.getArgs(): string[]`
- `ctx.getArg(index): string | undefined`
- `ctx.getMessage(): BotMessage`
- `ctx.getUserId(): string`
- `ctx.getChannelId(): string`
- `ctx.getServerId(): string`

### Действия

- `ctx.reply(text)` — отправить сообщение в текущий канал.
- `ctx.edit(messageId, text)` — редактировать сообщение.
- `ctx.react(reactionCode, messageId?)` — добавить реакцию.
- `ctx.unreact(reactionId)` — удалить реакцию по ID.
- `ctx.unreactByCode(reactionCode, messageId?)` — удалить реакцию по коду.

## 9. События `CommandManager`

Важно: эти события эмитятся **менеджером команд**, а не `BotClient`. Подписывайтесь на `bot.commands`.

```ts
bot.commands.on('commandExecuted', ({ commandName, args, message }) => {
  console.log(commandName, args, message.userId);
});
```

Доступные события:

- `commandExecuted`
- `commandNotFound`
- `commandError`

## 10. Сообщения: `bot.messages`

### Методы

- `send(serverId, channelId, text)`
- `sendWithMentions(serverId, channelId, text, { userTags?, roleIds? })`
- `edit(serverId, channelId, messageId, text)`
- `delete(channelId, messageId)`
- `addReaction(channelId, messageId, reactionCode)`
- `removeReaction(channelId, reactionId)`
- `removeReactionByCode(channelId, messageId, reactionCode)`
- `toggleReaction(channelId, messageId, reactionCode)`

### Пример

```ts
await bot.messages.send(serverId, channelId, 'Всем привет');
await bot.messages.sendWithMentions(serverId, channelId, 'Проверьте апдейт', {
  userTags: ['User#123456'],
  roleIds: ['role-id'],
});
```

## 11. Личные чаты: `bot.chats`

- `send(chatId, text)`
- `edit(chatId, messageId, text)`
- `delete(chatId, messageId)`

```ts
await bot.chats.send(chatId, 'Привет из бота');
```

## 12. Серверы: `bot.servers`

### Чтение данных

- `getUsers(serverId): Promise<BotServerUser[]>`
- `getData(serverId): Promise<{ id; name; isClosed; channels.textChannels[] }>`
- `getRoles(serverId)`

### Роли

- `addUserRole(serverId, userId, roleId)`
- `removeUserRole(serverId, userId, roleId)`
- `createRole(serverId, name, color)`
- `deleteRole(serverId, roleId)`
- `updateRole(serverId, roleId, name, color)`
- `updateRoleSettings(serverId, roleId, setting, add)`

### Модерация

- `getBannedUsers(serverId, page = 1, size = 20)`
- `banUser(serverId, userId, banReason?)`
- `unbanUser(serverId, userId)`

### `ServerRoleSetting`

```ts
enum ServerRoleSetting {
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
}
```

## 13. Каналы: `bot.channels`

### Методы

- `getChannels(serverId)`
- `createChannel(serverId, name, type, maxCount?)`
- `updateChannel(serverId, channelId, name)`
- `deleteChannel(serverId, channelId)`
- `getChannelSettings(serverId, channelId)`
- `changeChannelName(serverId, channelId, newName)`
- `changeChannelSettings(serverId, channelId, channelType, settingsData)`

### Типы каналов

```ts
enum ChannelType {
  Text = 'Text',
  Voice = 'Voice',
  Notification = 'Notification',
  Pair = 'Pair',
}
```

## 14. Голос и медиа: `bot.voice`

`VoiceManager` работает с mediasoup signaling для consumer-сценариев.

### Основные методы

- `connect()`
- `joinVoiceChannel({ serverId, voiceChannelId, userName?, userId? })`
- `leaveVoiceChannel(voiceChannelId?)`
- `createConsumerTransport()`
- `connectConsumerTransport(dtlsParameters, serverConsumerTransportId)`
- `getProducers()`
- `consume({ rtpCapabilities, remoteProducerId, serverConsumerTransportId })`
- `resumeConsumer(serverConsumerId)`
- `disconnect()`

### События VoiceManager

- `connected`
- `disconnected`
- `connectionSuccess`
- `newProducer`
- `producerAdded`
- `producerClosed`
- `activeSpeakers`
- `kicked`
- `kickedByNewBotSession`
- `leaveConfirmed`
- `leaveError`
- `mediaStream`
- `error`

### Удобные подписки с фильтрами

- `onProducerAdded(handler, filter?)`
- `onMediaStream(handler, filter?)`

`filter`:

```ts
interface MediaEventFilter {
  producerIds?: string[];
  userIds?: string[];
  kinds?: string[];
  sources?: Array<'screen-video' | 'screen-audio' | 'microphone' | 'camera'>;
  userNames?: string[];
}
```

## 15. Пул голосовых сессий: `bot.voicePool`

`VoicePoolManager` позволяет держать по одной voice-сессии на сервер.

### Методы

- `joinVoiceChannel(options)` — создать/пересоздать сессию для `serverId`.
- `getSession(serverId)`
- `getActiveServers()`
- `leaveServer(serverId)`
- `disconnectAll()`

### События VoicePoolManager

- `sessionJoined`
- `sessionLeft`
- `newProducer`
- `producerAdded`
- `mediaStream`
- `producerClosed`
- `activeSpeakers`
- `kickedByNewBotSession`
- `error`

## 16. Полноценные примеры

### Пример A: команды и логирование

```ts
const bot = new BotClient({ apiUrl, token });

bot.commands.setPrefix('/');

bot.commands.on('commandNotFound', ({ commandName }) => {
  console.warn('Неизвестная команда:', commandName);
});

bot.commands.register('help', async (ctx) => {
  const list = bot.commands.getAll().map((c) => `/${c}`).join('\n');
  await ctx.reply(`Доступные команды:\n${list}`);
});
```

### Пример B: управление каналами

```ts
import { ChannelType } from '@hitscord/bot-sdk';

bot.commands.register('create-text', async (ctx) => {
  const name = ctx.getArgs().join(' ') || 'new-channel';
  const result = await bot.channels.createChannel(
    ctx.getServerId(),
    name,
    ChannelType.Text,
  );

  await ctx.reply(result.success ? 'Канал создан' : `Ошибка: ${result.error}`);
});
```

### Пример C: удаление запрещенных сообщений

```ts
const banned = ['spam', 'badword'];

bot.on('messageCreate', async (message) => {
  if (message.text.startsWith('/')) return;
  const lowered = message.text.toLowerCase();
  if (!banned.some((w) => lowered.includes(w))) return;

  await bot.messages.delete(message.channelId, message.messageId);
  await bot.messages.send(
    message.serverId,
    message.channelId,
    `Сообщение пользователя ${message.userId} удалено модератором.`,
  );
});
```

### Пример D: прием медиапотоков

```ts
await bot.voicePool.joinVoiceChannel({
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
});
```

## 17. Ошибки и edge-cases

- Почти все методы завязаны на socket ack; используйте `try/catch`.
- При потере соединения проверяйте `bot.isAuth()` перед операциями.
- Для permission-gated операций учитывайте `Bot does not have required permission: ...`.
- Методы сообщений и серверов бросают `Socket not connected` при отсутствии подключения.

Рекомендуемый шаблон:

```ts
try {
  const res = await bot.messages.send(serverId, channelId, 'OK');
  if (!res.success) {
    console.error('API error:', res.error);
  }
} catch (e) {
  console.error('Transport error:', e);
}
```

## 18. Важные особенности текущей реализации

1. `commandPrefix` в `new BotClient({ commandPrefix })` сейчас не применяется автоматически.
   Используйте `bot.commands.setPrefix(...)` после подключения.
2. События `commandExecuted`, `commandNotFound`, `commandError` исходят из `CommandManager`.
   Подписка должна быть `bot.commands.on(...)`.
3. Входящие chat-сообщения не идут через `CommandManager`, используйте `bot.on('chatMessageCreate', ...)`.
4. Deprecated методы в `BotClient` (`command`, `getRegisteredCommands`, и т.д.) лучше не использовать в новом коде.

## 19. Где смотреть живые примеры

- [discord-style-bot.ts](bot-api/examples/discord-style-bot.ts)
- [classroom-manager-bot.ts](bot-api/examples/classroom-manager-bot.ts)
- [media-consumer-bot.ts](bot-api/examples/media-consumer-bot.ts)
- [voice-recorder-bot.ts](bot-api/examples/voice-recorder-bot.ts)
