import { Button, Flex, Group, Title } from '@mantine/core';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from '~/hooks';

export const LandingPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.userStore);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/main');
    }
  }, [isLoggedIn, navigate]);

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
      <Title order={3}>Добро пожаловать в Hitscord!</Title>
      <Group gap="20px">
        <Link to="/login">
          <Button variant="filled" radius="md">
            Войти
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="filled" radius="md">
            Зарегистрироваться
          </Button>
        </Link>
        <Link to="/bots">
          <Button variant="light" radius="md">
            Выбрать бота
          </Button>
        </Link>
      </Group>
    </Flex>
  );
};
