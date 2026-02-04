import { checkUserVoted } from './checkUserVoted';

import { VoteVariant } from '~/store/ServerStore';

export const getInitialData = (votes: VoteVariant[], userId: string) => {
  return votes.map((vote) => ({
    id: vote.id,
    checked: checkUserVoted(vote, userId),
  }));
};
