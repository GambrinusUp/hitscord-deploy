import { Button } from '@mantine/core';
import { X } from 'lucide-react';

import { deleteApplication } from '~/entities/friendship';
import { useAppDispatch } from '~/hooks';

interface DeleteApplicationProps {
  applicationId?: string;
}

export const DeleteApplication = ({
  applicationId,
}: DeleteApplicationProps) => {
  const dispatch = useAppDispatch();

  const handleDeleteApplication = () => {
    if (applicationId) {
      dispatch(deleteApplication({ applicationId }));
    }
  };

  return (
    <Button
      leftSection={<X />}
      variant="light"
      color="red"
      radius="md"
      onClick={handleDeleteApplication}
    >
      Отменить
    </Button>
  );
};
