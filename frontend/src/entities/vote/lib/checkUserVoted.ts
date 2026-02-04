import { VoteVariant } from '~/store/ServerStore';

export const checkUserVoted = (vote: VoteVariant, userId: string): boolean => {
  return !!vote.votedUserIds.find((id) => id === userId);
};

export const checkUserVotedAll = (
  votes: VoteVariant[],
  userId: string,
): boolean => {
  return votes.some((vote) => vote.votedUserIds.includes(userId));
};
