import { MessageType } from '~/entities/message';
import { VoteVariant } from '~/store/ServerStore';

export interface CreateVoteVariant {
  number: number;
  content: string;
}

export interface CreateVote {
  title: string;
  content?: string;
  isAnonimous: boolean;
  multiple: boolean;
  deadLine?: string;
  variants: CreateVoteVariant[];
}

export interface Vote {
  Token: string;
  VoteVariantId: string;
  isChannel: boolean;
}

export interface PollItemProps {
  pollId: number;
  authorId: string;
  isOwnMessage: boolean;
  type: MessageType;
  time: string;
  title: string;
  totalUsers: number;
  content?: string | null;
  variants: VoteVariant[];
  multiple: boolean;
  deadLine?: string | null;
  isAnonimous: boolean;
  onReplyMessage: () => void;
}

export interface VoteVariantsForm {
  votes: {
    id: string;
    checked: boolean;
  }[];
}
