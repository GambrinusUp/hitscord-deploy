import { Avatar, Button, Flex, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getUserProfile } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { decodeInvitation } from '~/shared/lib/utils';
import {
  combineValidators,
  minLength,
  maxLength,
} from '~/shared/lib/validators';
import { subscribeToServer } from '~/store/ServerStore';

export const InvitationPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const { ServerName, ServerIconId, InvitationToken } = decodeInvitation(
    code || '',
  );
  const { iconBase64 } = useIcon(ServerIconId);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);
  const form = useForm({
    initialValues: {
      userName: user.name,
    },
    validate: {
      userName: combineValidators(minLength(6, 'Имя'), maxLength(50, 'Имя')),
    },
  });

  const handleConnectSubmit = async (values: typeof form.values) => {
    if (!InvitationToken) return;

    const result = await dispatch(
      subscribeToServer({
        invitationToken: InvitationToken,
        userName: values.userName,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/main');
      form.reset();
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const result = await dispatch(getUserProfile());

      if (result.meta.requestStatus !== 'fulfilled') {
        navigate('/main');
      }
    };

    if (!user.name) {
      fetchUserProfile();
    }
  }, [user.name]);

  useEffect(() => {
    form.setFieldValue('userName', user.name);
  }, [user.name]);

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
      <form onSubmit={form.onSubmit(handleConnectSubmit)}>
        <Stack align="center" gap="20px">
          <Title order={3}>Вас пригласили на сервер: {ServerName}</Title>
          <Avatar size={100} radius={50} src={iconBase64} />
          <TextInput
            variant="filled"
            label="Имя на сервере"
            placeholder="Введите имя на сервере"
            w={500}
            radius="md"
            {...form.getInputProps('userName')}
          />
          <Button type="submit" fullWidth variant="default" radius="md">
            Войти
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};
