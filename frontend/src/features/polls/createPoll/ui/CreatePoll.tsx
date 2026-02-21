import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChartBarIncreasing } from 'lucide-react';

import { CreatePollModal } from './CreatePollModal';

import { MessageType } from '~/entities/message';

interface CreatePollProps {
  type: MessageType;
  disabled?: boolean;
}

export const CreatePoll = ({ type, disabled = false }: CreatePollProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCreatePoll = () => {
    if (disabled) return;

    open();
  };

  return (
    <>
      <ActionIcon
        component="label"
        size="xl"
        variant="transparent"
        disabled={disabled}
        onClick={handleCreatePoll}
      >
        <ChartBarIncreasing size={20} />
      </ActionIcon>
      <CreatePollModal type={type} opened={opened} close={close} />
    </>
  );
};
