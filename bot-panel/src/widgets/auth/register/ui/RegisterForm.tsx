import {
  Flex,
  Card,
  ActionIcon,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegister } from '~/entities/auth';
import {
  combineValidators,
  isEmail,
  maxLength,
  minLength,
  useAppSelector,
} from '~/shared';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.authStore);
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: combineValidators(
        minLength(6, 'Email'),
        maxLength(50, 'Email'),
        isEmail,
      ),
      name: combineValidators(minLength(6, 'Имя'), maxLength(50, 'Имя')),
      password: minLength(6, 'Пароль'),
    },
  });

  useEffect(() => {
    if (error) {
      let errorMessage = 'Ошибка при регистрации. Попробуйте снова';

      if (error instanceof Error) {
        if ('response' in error && typeof error.response === 'object' && error.response !== null) {
          const response = error.response as any;
          if (response.data?.message) {
            errorMessage = response.data.message;
          }
        } else {
          errorMessage = error.message;
        }
      }

      notifications.show({
        title: 'Ошибка регистрации',
        message: errorMessage,
        color: 'red',
        autoClose: 5000,
      });
    }
  }, [error]);

  const handleSubmit = async (values: typeof form.values) => {
    register(values, {
      onSuccess: () => {
        navigate('/main');
      },
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/main');
    }
  }, [accessToken, navigate]);

  return (
    <Flex
      w="100vw"
      h="100vh"
      gap="md"
      justify="center"
      align="center"
      direction="column"
      bg="linear-gradient(135deg, #4a90e2, #7b4397)"
    >
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
          <Text fw={500}> Создать учётную запись</Text>
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
            <TextInput
              label="ФИО"
              placeholder="Введите ФИО"
              description="от 6 до 50 символов"
              {...form.getInputProps('name')}
              maxLength={50}
              required
              disabled={isPending}
            />
            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              description="от 6 символов"
              {...form.getInputProps('password')}
              required
              disabled={isPending}
            />
            <Group justify="center" mt="md">
              <Button type="submit" loading={isPending}>
                Создать
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Flex>
  );
};
