import { Button } from '@mantine/core';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { useUploadIcon } from '~/features/settings/updateIcon/lib';

interface UpdateIconProps {
  type: 'profile' | 'server' | 'chat';
}

export const UpdateIcon = ({ type }: UpdateIconProps) => {
  const { validateAndUpload } = useUploadIcon({ type });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      validateAndUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="light"
        radius="md"
        leftSection={<Upload />}
        onClick={handleClick}
      >
        Загрузить {type === 'profile' ? 'фото' : 'иконку'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
};
