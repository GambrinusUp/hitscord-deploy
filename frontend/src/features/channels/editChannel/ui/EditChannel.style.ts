export const editChannelStyles = {
  buttonSettings: (current: boolean) => ({
    backgroundColor: current ? '#999999' : 'transparent',
    '--button-hover-color': '#4f4f4f',
    transition: 'color 0.3s ease',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }),
};
