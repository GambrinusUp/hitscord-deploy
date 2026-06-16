import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import React from 'react';

import {
  isEmail,
  minLength,
  maxLength,
  combineValidators,
} from '~/shared/validators/validators';

interface BotInfoFormProps {
  onNext: (data: { name: string; description: string; mail: string }) => void;
  initialData?: {
    name: string;
    description: string;
    mail: string;
  };
}

export const BotInfoForm = ({ onNext, initialData }: BotInfoFormProps) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(
    initialData?.description || '',
  );
  const [mail, setMail] = React.useState(
    initialData?.mail || 'developer@example.com',
  );
  const [errors, setErrors] = React.useState<{
    name?: string;
    description?: string;
    mail?: string;
  }>({});

  const nameValidator = combineValidators(
    minLength(1, 'Имя'),
    maxLength(50, 'Имя'),
  );

  const descValidator = combineValidators(
    minLength(5, 'Описание'),
    maxLength(500, 'Описание'),
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    const nameError = nameValidator(name);

    if (nameError) newErrors.name = nameError;

    const descError = descValidator(description);

    if (descError) newErrors.description = descError;

    const mailError = isEmail(mail);

    if (mailError) newErrors.mail = mailError;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ name, description, mail });
    }
  };

  return (
    <Stack gap="lg" w="100%" maw={500}>
      <TextInput
        label="Имя бота"
        placeholder="Введите имя бота"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        error={errors.name}
        required
      />
      <Textarea
        label="Описание бота"
        placeholder="Введите описание бота"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        error={errors.description}
        minRows={3}
        required
      />
      <TextInput
        label="Email"
        placeholder="developer@example.com"
        value={mail}
        onChange={(e) => setMail(e.currentTarget.value)}
        error={errors.mail}
        required
      />
      <Group justify="center" mt="lg">
        <Button onClick={handleNext} variant="filled">
          Далее
        </Button>
      </Group>
    </Stack>
  );
};
