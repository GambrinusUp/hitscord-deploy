export interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
}

export interface MentionSuggestion {
  type: 'user' | 'role';
  id: string;
  display: string;
  tag: string;
  startIndex: number;
  searchText: string;
}
