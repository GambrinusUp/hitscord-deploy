export interface MockServer {
  id: string;
  name: string;
  membersCount: number;
}

export const mockServers: MockServer[] = [
  { id: '1', name: 'Клуб по алгебре', membersCount: 42 },
  { id: '2', name: 'Frontend Team', membersCount: 18 },
  { id: '3', name: 'Подготовка к ЕГЭ', membersCount: 76 },
];
