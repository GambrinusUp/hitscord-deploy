export const styles = {
  buttonRoot: (isHovered: boolean, current: boolean) => ({
    backgroundColor: current ? '#999999' : 'transparent',
    '--button-hover-color': '#4f4f4f',
    transition: 'color 0.3s ease',
    borderTopRightRadius: isHovered ? 0 : 'var(--mantine-radius-default)',
    borderBottomRightRadius: isHovered ? 0 : 'var(--mantine-radius-default)',
  }),
  buttonSettings: (current: boolean) => ({
    backgroundColor: current ? '#999999' : 'transparent',
    '--button-hover-color': '#4f4f4f',
    transition: 'color 0.3s ease',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }),
};
