export const formatMessage = (text: string): string => {
  text = text.replace(
    /\/\/\{usertag:([a-zA-Zа-яА-ЯёЁ0-9_#]+)\}\/\//g,
    '<span style="color: #ffffff; font-weight: 500;">@$1</span>',
  );

  text = text.replace(
    /\/\/\{roletag:([a-zA-Zа-яА-ЯёЁ0-9_-]+)\}\/\//g,
    '<span style="color: #ffffff; font-weight: 500;">@$1</span>',
  );

  return text;
};
