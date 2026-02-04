import { Button } from '@mantine/core';
import { Check } from 'lucide-react';

import { approveApplication } from '~/entities/friendship';
import { useAppDispatch } from '~/hooks';

interface ApproveApplicationProps {
  applicationId?: string;
}

export const ApproveApplication = ({
  applicationId,
}: ApproveApplicationProps) => {
  const dispatch = useAppDispatch();

  const handleApproveApplication = () => {
    if (applicationId) {
      dispatch(approveApplication({ applicationId }));
    }
  };

  return (
    <Button
      leftSection={<Check />}
      variant="light"
      color="green"
      radius="md"
      onClick={handleApproveApplication}
    >
      Принять
    </Button>
  );
};
