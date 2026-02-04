import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Settings } from 'lucide-react';

import { EditSettingsModal } from './EditSettingsModal';

export const EditSettings = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon variant="transparent" color="gray" onClick={open}>
        <Settings />
      </ActionIcon>
      <EditSettingsModal opened={opened} onClose={close} />
    </>
  );
};
