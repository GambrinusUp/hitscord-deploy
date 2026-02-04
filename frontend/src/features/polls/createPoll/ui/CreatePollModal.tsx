import {
  Button,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Plus } from 'lucide-react';

import { VariantItem } from './VariantItem';

import { MessageType } from '~/entities/message';
import { CreateVote } from '~/entities/vote';
import { INITIAL_FORM } from '~/features/polls/createPoll/constants';
import { validateDeadLine } from '~/features/polls/createPoll/lib';
import { useAppSelector } from '~/hooks';
import {
  combineValidators,
  maxLength,
  minLength,
} from '~/shared/lib/validators';
import { useWebSocket } from '~/shared/lib/websocket';
import { ServerMessageType } from '~/store/ServerStore';

interface CreatePollModalProps {
  type: MessageType;
  opened: boolean;
  close: () => void;
}

export const CreatePollModal = ({
  type,
  opened,
  close,
}: CreatePollModalProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { sendMessage, sendChatMessage } = useWebSocket();

  const form = useForm<CreateVote>({
    initialValues: INITIAL_FORM,

    validate: {
      title: combineValidators(
        minLength(1, 'Заголовок'),
        maxLength(5000, 'Заголовок'),
      ),
      content: combineValidators(
        minLength(1, 'Описание'),
        maxLength(5000, 'Описание'),
      ),
      deadLine: validateDeadLine,

      variants: {
        content: combineValidators(
          minLength(1, 'Содержимое варианта'),
          maxLength(5000, 'Содержимое варианта'),
        ),
      },
    },
  });

  const fields = form.getValues().variants;

  const handleSubmit = async (values: CreateVote) => {
    const { title, content, isAnonimous, multiple, deadLine, variants } =
      values;

    const isoDate = deadLine ? new Date(deadLine).toISOString() : undefined;

    const renumberedVariants = variants
      .sort((a, b) => a.number - b.number)
      .map((variant, index) => ({
        Number: index + 1,
        Content: variant.content,
    }));

    const votePayload = {
      Title: title,
      Content: content,
      IsAnonimous: isAnonimous,
      Multiple: multiple,
      Deadline: isoDate,
      Variants: renumberedVariants,
    };

    if (type === MessageType.CHANNEL && currentChannelId) {
      sendMessage({
        Token: accessToken,
        ChannelId: currentChannelId,
        Vote: votePayload,
        MessageType: ServerMessageType.Vote,
      });
    }

    if (type === MessageType.SUBCHAT && currentSubChatId) {
      sendMessage({
        Token: accessToken,
        ChannelId: currentSubChatId,
        Vote: votePayload,
        MessageType: ServerMessageType.Vote,
      });
    }

    if (type === MessageType.CHAT && activeChat) {
      sendChatMessage({
        Token: accessToken,
        ChannelId: activeChat,
        Vote: votePayload,
        MessageType: ServerMessageType.Vote,
      });
    }

    form.reset();
    close();
  };

  const handleAddVariant = () => {
    form.insertListItem('variants', { number: fields.length + 1, content: '' });
  };

  const handleClose = () => {
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Создание опроса"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Заголовок опроса"
            required
            placeholder="Введите заголовок"
            key={form.key('title')}
            {...form.getInputProps('title')}
            maxLength={5000}
            radius="md"
          />
          <Textarea
            label="Описание (опционально)"
            placeholder="Введите описание"
            key={form.key('content')}
            {...form.getInputProps('content')}
            autosize
            minRows={1}
            maxRows={3}
            maxLength={5000}
            radius="md"
          />
          <Text>Варианты ответов</Text>
          {fields.map((field, index) => (
            <VariantItem key={field.number} form={form} index={index} />
          ))}
          <Button
            variant="light"
            leftSection={<Plus />}
            onClick={handleAddVariant}
            radius="md"
          >
            Добавить вариант
          </Button>
          <Group justify="space-between">
            <Text>Анонимный опрос</Text>
            <Switch
              size="lg"
              key={form.key('isAnonimous')}
              {...form.getInputProps('isAnonimous', {
                type: 'checkbox',
              })}
            />
          </Group>
          <Group justify="space-between">
            <Text>Множественный выбор</Text>
            <Switch
              size="lg"
              key={form.key('multiple')}
              {...form.getInputProps('multiple', {
                type: 'checkbox',
              })}
            />
          </Group>
          <DateTimePicker
            label="Дедлайн (опционально)"
            placeholder="Дата не выбрана"
            key={form.key('deadLine')}
            {...form.getInputProps('deadLine')}
            radius="md"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
