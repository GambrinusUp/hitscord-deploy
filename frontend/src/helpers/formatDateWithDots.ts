export const formatDateWithDots = (dateStr: string) => {
  const [year, month, day] = dateStr
    .split('-')
    .map((part) => part.padStart(2, '0'));

  return `${day}.${month}.${year}`;
};
