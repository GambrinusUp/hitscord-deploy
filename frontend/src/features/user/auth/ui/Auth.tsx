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

import { loginUser } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  combineValidators,
  isEmail,
  maxLength,
  minLength,
} from '~/shared/lib/validators';

export const Auth = () => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      mail: '',
      password: '',
    },

    validate: {
      mail: combineValidators(
        minLength(6, 'Email'),
        maxLength(50, 'Email'),
        isEmail,
      ),
      password: minLength(6, 'Пароль'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = await dispatch(loginUser(values));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/main');
    }
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
            {...form.getInputProps('mail')}
            maxLength={50}
            required
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            {...form.getInputProps('password')}
            required
          />
          <Group justify="center" mt="md">
            <Button type="submit">Войти</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
