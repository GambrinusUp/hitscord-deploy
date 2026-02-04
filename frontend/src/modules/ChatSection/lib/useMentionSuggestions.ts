import { useEffect, useRef, useState } from 'react';

import { UserInChat } from '~/entities/chat';
import { MentionSuggestion } from '~/modules/ChatSection/ChatSection.types';
import { UserOnServer, Role } from '~/store/ServerStore';

interface UseMentionSuggestionsProps {
  users: UserOnServer[] | UserInChat[];
  roles: Role[] | undefined;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  newMessage: string;
  setNewMessage: (value: React.SetStateAction<string>) => void;
}

export const useMentionSuggestions = ({
  users,
  roles,
  textareaRef,
  newMessage,
  setNewMessage,
}: UseMentionSuggestionsProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentMention, setCurrentMention] =
    useState<MentionSuggestion | null>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);

  const findMentionAtCursor = (
    text: string,
    cursorPosition: number,
  ): MentionSuggestion | null => {
    const before = text.slice(0, cursorPosition);
    const match = before.match(/@([\w#-]*)$/);

    if (match) {
      const search = match[1];
      const atIndex = before.lastIndexOf('@');

      return {
        type: 'user',
        id: '',
        display: '',
        tag: '',
        startIndex: atIndex,
        searchText: search,
      };
    }

    return null;
  };

  const filterSuggestions = (
    mention: MentionSuggestion,
  ): MentionSuggestion[] => {
    const text = mention.searchText.toLowerCase();

    const userMatches = users
      .filter((u) => `${u.userName}#${u.userTag}`.toLowerCase().includes(text))
      .slice(0, 5)
      .map((u) => ({
        type: 'user' as const,
        id: u.userId,
        display: u.userName,
        tag: `${u.userTag}`,
        startIndex: mention.startIndex,
        searchText: mention.searchText,
      }));

    const roleMatches = roles
      ? roles
          .filter(
            (r) =>
              r.name.toLowerCase().includes(text) ||
              r.tag.toLowerCase().includes(text),
          )
          .slice(0, 5)
          .map((r) => ({
            type: 'role' as const,
            id: r.id,
            display: r.name,
            tag: r.tag,
            startIndex: mention.startIndex,
            searchText: mention.searchText,
          }))
      : [];

    return [...userMatches, ...roleMatches];
  };

  const clearSuggestions = () => {
    setShowSuggestions(false);
    setCurrentMention(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart || 0;
    setNewMessage(val);
    const mention = findMentionAtCursor(val, pos);

    if (mention) {
      const list = filterSuggestions(mention);
      setSuggestions(list);
      setCurrentMention(mention);
      setShowSuggestions(list.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setCurrentMention(null);
    }
  };

  const insertMention = (item: MentionSuggestion) => {
    if (!currentMention || !textareaRef.current) return;

    const before = newMessage.slice(0, currentMention.startIndex);
    const after = newMessage.slice(textareaRef.current.selectionStart || 0);
    const mentionText =
      item.type === 'user' ? `@${item.tag} ` : `@${item.tag} `;
    const updated = before + mentionText + after;
    setNewMessage(updated);
    setShowSuggestions(false);
    setCurrentMention(null);
    setTimeout(() => {
      const pos = before.length + mentionText.length;
      textareaRef.current!.setSelectionRange(pos, pos);
      textareaRef.current!.focus();
    }, 0);
  };

  const downSuggestion = () => {
    setSelectedSuggestionIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0,
    );
  };

  const upSuggestion = () => {
    setSelectedSuggestionIndex((prev) =>
      prev > 0 ? prev - 1 : suggestions.length - 1,
    );
  };

  const enterSuggestion = () => {
    if (suggestions[selectedSuggestionIndex]) {
      insertMention(suggestions[selectedSuggestionIndex]);
    }
  };

  const cancelSuggestion = () => {
    setShowSuggestions(false);
    setCurrentMention(null);
  };

  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;

      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex, showSuggestions]);

  return {
    suggestionsRef,
    suggestions,
    showSuggestions,
    clearSuggestions,
    handleTextChange,
    insertMention,
    downSuggestion,
    upSuggestion,
    enterSuggestion,
    cancelSuggestion,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
  };
};
