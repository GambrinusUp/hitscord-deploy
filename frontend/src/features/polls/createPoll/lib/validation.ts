export const validateDeadLine = (value: string | undefined) => {
  if (!value) return null;

  const deadlineDate = new Date(value);
  const minDeadline = new Date(Date.now() + 5 * 60 * 1000);

  if (deadlineDate < minDeadline) {
    return 'Дедлайн должен быть как минимум через 5 минут';
  }

  return null;
};
