import {
  ActionIcon,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogin } from '~/entities/auth';
import {
  combineValidators,
  isEmail,
  maxLength,
  minLength,
  useAppSelector,
  useNotification,
} from '~/shared';

export const AuthForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();
  const { accessToken } = useAppSelector((state) => state.authStore);
  const { showError } = useNotification();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: combineValidators(
        minLength(6, 'Email'),
        maxLength(50, 'Email'),
        isEmail,
      ),
      password: minLength(6, 'Пароль'),
    },
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Ошибка при входе. Проверьте email и пароль';

      if (error instanceof Error) {
        if (
          'response' in error &&
          typeof error.response === 'object' &&
          error.response !== null
        ) {
          const response = error.response as unknown as {
            data?: { message?: string };
          };

          if (response.data?.message) {
            errorMessage = response.data.message;
          }
        } else {
          errorMessage = error.message;
        }
      }

      showError(errorMessage);
    }
  }, [error]);

  const handleSubmit = async (values: typeof form.values) => {
    login(values, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      bg="#1c1c1c"
      c="white"
      w="30vw"
      miw="300px"
    >
      <Group justify="space-between" align="center" mb="md">
        <Text fw={500}>Войти в учётную запись</Text>
        <ActionIcon variant="subtle" onClick={handleBack}>
          <ArrowLeft size={24} />
        </ActionIcon>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="Введите email"
            {...form.getInputProps('email')}
            maxLength={50}
            required
            disabled={isPending}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            {...form.getInputProps('password')}
            required
            disabled={isPending}
          />
          <Group justify="center" mt="md">
            <Button type="submit" loading={isPending}>
              Войти
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
