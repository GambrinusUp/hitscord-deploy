import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChartBarIncreasing } from 'lucide-react';

import { CreatePollModal } from './CreatePollModal';

import { MessageType } from '~/entities/message';

interface CreatePollProps {
  type: MessageType;
}

export const CreatePoll = ({ type }: CreatePollProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCreatePoll = () => {
    open();
  };

  return (
    <>
      <ActionIcon
        component="label"
        size="xl"
        variant="transparent"
        onClick={handleCreatePoll}
      >
        <ChartBarIncreasing size={20} />
      </ActionIcon>
      <CreatePollModal type={type} opened={opened} close={close} />
    </>
  );
};
