const defaultOrigin = 'https://62.76.142.57';

export const API_URL =
  import.meta.env.VITE_BASE_URL?.replace(/\/api\/?$/, '') || defaultOrigin;
export const WEBSOCKET_MEDIA_URL =
  import.meta.env.VITE_MEDIA_URL || `${defaultOrigin}/mediasoup`;
export const MAX_MESSAGE_NUMBER = 15;

export const SETTINGS_NAMES = {
  canChangeRole: 'Может менять роль',
  canWorkChannels: 'Работает с каналами',
  canDeleteUsers: 'Может удалять пользователей',
  canMuteOther: 'Может замутить других',
  canDeleteOthersMessages: 'Может удалять чужие сообщения',
  canIgnoreMaxCount: 'Игнорирует лимит участников',
  canCreateRoles: 'Может создавать роли',
  canCreateLessons: 'Может создавать уроки',
  canCheckAttendance: 'Может проверять посещаемость',
  canUseInvitations: 'Может использовать приглашения',
};
