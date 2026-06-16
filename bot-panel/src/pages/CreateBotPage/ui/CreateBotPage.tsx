import { AppShell, Stepper, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateBot } from '~/entities/bots';
import { AppHeader } from '~/widgets';
import {
  BotInfoForm,
  BotPermissionsForm,
  BotConfirmationForm,
} from '~/features/bots/ManageBotForm';

interface BotFormData {
  name: string;
  description: string;
  mail: string;
}

export const CreateBotPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    description: '',
    mail: 'developer@example.com',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    mutate: createBot,
    isPending,
    data: createdBot,
    error,
  } = useCreateBot();

  const handleStep1Next = (data: BotFormData) => {
    setFormData(data);
    setActive(1);
  };

  const handleStep2Next = (permissions: string[]) => {
    setSelectedPermissions(permissions);
    setActive(2);

    createBot({
      name: formData.name,
      description: formData.description,
      mail: formData.mail,
      permissions,
    });
  };

  const handleBackFromStep2 = () => {
    setActive(0);
  };

  const handleBackFromStep3 = () => {
    setActive(1);
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Stack w="100%" h="calc(100vh - 100px)" align="center" justify="center">
          <Stepper
            active={active}
            onStepClick={setActive}
            size="lg"
            w="100%"
            maw={1000}
            styles={{
              content: {
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 'var(--mantine-spacing-xl)',
              },
            }}
          >
            <Stepper.Step
              label="Основная информация"
              description="Имя и описание"
            >
              <BotInfoForm onNext={handleStep1Next} initialData={formData} />
            </Stepper.Step>
            <Stepper.Step label="Разрешения" description="Выберите права">
              <BotPermissionsForm
                onNext={handleStep2Next}
                onBack={handleBackFromStep2}
                initialPermissions={selectedPermissions}
              />
            </Stepper.Step>
            <Stepper.Step label="Подтверждение" description="Готово!">
              <BotConfirmationForm
                bot={createdBot || null}
                isLoading={isPending}
                error={error}
                onBack={handleBackFromStep3}
                onFinish={handleFinish}
              />
            </Stepper.Step>
            <Stepper.Completed>
              Бот успешно создан! Перенаправление на dashboard...
            </Stepper.Completed>
          </Stepper>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
