import { Card, Divider, ScrollArea, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

import { SettingsForm } from '~/entities/user';
import { EditSettings } from '~/features/settings/editSettings';
import { PrivacySettings } from '~/features/settings/privacySettings';
import { ProfileSettings } from '~/features/settings/profileSettings';
import { UpdateIcon } from '~/features/settings/updateIcon';
import { useAppSelector } from '~/hooks';
import {
  combineValidators,
  isEmail,
  maxLength,
  minLength,
} from '~/shared/lib/validators';

export const Settings = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAppSelector((state) => state.userStore);

  const form = useForm<SettingsForm>({
    mode: 'uncontrolled',
    initialValues: {
      email: user.mail,
      name: user.name,
      notifiable: user.notifiable,
      friendshipApplication: user.friendshipApplication,
      nonFriendMessage: user.nonFriendMessage,
      notificationLifeTime: user.notificationLifeTime,
    },

    validate: {
      email: combineValidators(
        minLength(6, 'Email'),
        maxLength(50, 'Email'),
        isEmail,
      ),
      name: combineValidators(minLength(6, 'Имя'), maxLength(50, 'Имя')),
    },
  });

  return (
    <Stack p="xl" gap="md" w="100%">
      <Card
        withBorder
        radius="md"
        w="100%"
        styles={{ root: { backgroundColor: '#1a1b1e' } }}
      >
        <ScrollArea.Autosize w="100%" h="100%" offsetScrollbars>
          <ProfileSettings
            isEdit={isEdit}
            form={form}
            systemRoles={user.systemRoles}
            updateAction={<UpdateIcon type={'profile'} />}
          />
          <Divider mt="md" mb="md" />
          <PrivacySettings isEdit={isEdit} form={form} />
        </ScrollArea.Autosize>
      </Card>
      <EditSettings isEdit={isEdit} setIsEdit={setIsEdit} form={form} />
    </Stack>
  );
};
