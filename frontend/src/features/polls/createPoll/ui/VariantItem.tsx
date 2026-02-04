import { ActionIcon, Group, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { X } from 'lucide-react';

import { CreateVote } from '~/entities/vote/model/types';

interface VariantItemProps {
  form: UseFormReturnType<CreateVote>;
  index: number;
}

export const VariantItem = ({ form, index }: VariantItemProps) => {
  const variantsLength = form.getValues().variants.length;

  const handleRemoveItem = () => {
    form.removeListItem('variants', index);
  };

  return (
    <Group align="center" gap="xs">
      <TextInput
        placeholder={`Вариант №${index + 1}`}
        withAsterisk
        key={form.key(`variants.${index}.content`)}
        {...form.getInputProps(`variants.${index}.content`)}
        style={{ flex: 1 }}
        radius="md"
      />
      {variantsLength > 2 && (
        <ActionIcon color="red" variant="light" onClick={handleRemoveItem}>
          <X size={16} />
        </ActionIcon>
      )}
    </Group>
  );
};
