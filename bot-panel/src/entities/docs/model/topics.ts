export interface DocsTopic {
  id: string;
  title: string;
}

export const DOCS_TOPICS: DocsTopic[] = [
  { id: 'overview', title: '1. Что такое SDK' },
  { id: 'quick-start', title: '2. Быстрый старт' },
  { id: 'bot-client', title: '3. Инициализация BotClient' },
  { id: 'lifecycle', title: '4. Жизненный цикл подключения' },
  { id: 'permissions', title: '5. Данные бота и права' },
  { id: 'events', title: '6. События BotClient' },
  { id: 'commands', title: '7. Команды: bot.commands' },
  { id: 'command-context', title: '8. CommandContext' },
  { id: 'command-events', title: '9. События CommandManager' },
  { id: 'messages', title: '10. Сообщения: bot.messages' },
  { id: 'chats', title: '11. Личные чаты: bot.chats' },
  { id: 'servers', title: '12. Серверы: bot.servers' },
  { id: 'channels', title: '13. Каналы: bot.channels' },
  { id: 'voice', title: '14. Голос и медиа: bot.voice' },
  { id: 'voice-pool', title: '15. Пул голосовых сессий: bot.voicePool' },
  { id: 'examples', title: '16. Полноценные примеры' },
  { id: 'errors', title: '17. Ошибки и edge-cases' },
];
