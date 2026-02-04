import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CirclePlus } from 'lucide-react';

import { CreateServerModal } from './CreateServerModal';

import { useAppSelector } from '~/hooks';

export const CreateServer = () => {
  const {systemRoles} = useAppSelector((state) => state.userStore.user);
  const [opened, { open, close }] = useDisclosure(false);

  const canCreateServer = systemRoles.length > 0;

  return (
    <>
      <ActionIcon size="lg" variant="transparent" onClick={open} disabled={!canCreateServer}>
        <CirclePlus size={28} color="#fff" />
      </ActionIcon>
      <CreateServerModal opened={opened} onClose={close} />
    </>
  );
};
