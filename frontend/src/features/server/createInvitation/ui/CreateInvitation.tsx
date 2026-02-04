import { Alert, Button, CopyButton, Modal, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { createInvitation } from '~/store/ServerStore';

interface CreateInvitationProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateInvitation = ({
  opened,
  onClose,
}: CreateInvitationProps) => {
  const dispatch = useAppDispatch();
  const { currentServerId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const minDate = new Date(Date.now() + 10 * 60 * 1000);
  const invitationString = serverData.invitationString;

  const handleCreate = async () => {
    if (!selectedDate) {
      setError('Выберите дату и время истечения приглашения');

      return;
    }

    setIsCreating(true);
    setError(null);

    dispatch(
      createInvitation({
        serverId: currentServerId!,
        expiredAt: selectedDate.toISOString(),
      }),
    );

    setIsCreating(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Создать приглашение"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
      size="auto"
    >
      <Stack gap="md">
        <DateTimePicker
          description="Время истечения приглашения (минимум +10 минут)"
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={minDate}
          valueFormat="DD.MM.YYYY HH:mm"
          placeholder="Выберите дату и время"
          withSeconds={false}
          error={
            error && !invitationString ? 'Выберите корректное время' : undefined
          }
          disabled={!!invitationString}
        />

        {invitationString ? (
          <Stack>
            <Alert
              radius="md"
              variant="outline"
              color="gray"
              title="Приглашение создано!"
            >
              <CopyButton
                value={`https://gambrinusup.github.io/hitscord-frontend/#/invite/${invitationString}`}
              >
                {({ copied, copy }) => (
                  <Button radius="md" variant="light" onClick={copy}>
                    {copied ? 'Скопировано' : 'Скопировать ссылку'}
                  </Button>
                )}
              </CopyButton>
              <Button
                radius="md"
                color="gray"
                onClick={onClose}
                mt="sm"
                fullWidth
              >
                Закрыть
              </Button>
            </Alert>
          </Stack>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!selectedDate || isCreating}
            loading={isCreating}
            fullWidth
          >
            Создать приглашение
          </Button>
        )}

        {error && !invitationString && (
          <Alert color="red" title="Ошибка">
            {error}
          </Alert>
        )}
      </Stack>
    </Modal>
  );
};
