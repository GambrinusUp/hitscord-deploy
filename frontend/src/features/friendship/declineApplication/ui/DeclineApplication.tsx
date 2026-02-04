import { Button } from '@mantine/core';
import { X } from 'lucide-react';

import { declineApplication } from '~/entities/friendship';
import { useAppDispatch } from '~/hooks';

interface DeclineApplicationProps {
  applicationId?: string;
}

export const DeclineApplication = ({
  applicationId,
}: DeclineApplicationProps) => {
  const dispatch = useAppDispatch();

  const handleDeclineApplication = () => {
    if (applicationId) {
      dispatch(declineApplication({ applicationId }));
    }
  };

  return (
    <Button
      leftSection={<X />}
      variant="light"
      color="red"
      radius="md"
      onClick={handleDeclineApplication}
    >
      Отклонить
    </Button>
  );
};
