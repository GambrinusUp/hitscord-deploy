import { Flex } from '@mantine/core';

import { Register } from '~/features/user/register';

export const RegistrationPage = () => {
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
      <Register />
    </Flex>
  );
};
