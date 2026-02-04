import { CreateVote } from '~/entities/vote';

export const INITIAL_FORM: CreateVote = {
  title: '',
  content: undefined,
  isAnonimous: false,
  multiple: false,
  deadLine: undefined,
  variants: [
    {
      number: 1,
      content: '',
    },
    {
      number: 2,
      content: '',
    },
  ],
};
