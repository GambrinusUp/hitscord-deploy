import data from '@emoji-mart/data';
import i18n from '@emoji-mart/data/i18n/ru.json';
import Picker from '@emoji-mart/react';
i18n.search_no_results_1 = 'Нет смайликов';

interface Props {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onSelect }: Props) => {
  return (
    <Picker
      i18n={i18n}
      data={data}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEmojiSelect={(emoji: any) => {
        console.log(emoji);
        onSelect(emoji.native);
        //onSelect(emoji.unified);
      }}
      theme="dark"
      previewPosition="none"
    />
  );
};
