export const formatTagMessage = (message: string) => {
  message = message.replace(/@([a-zA-Z]+#\d+)/g, '//{usertag:$1}//');
  message = message.replace(/@([a-zA-Z0-9_-]+)/g, (match, p1) => {
    if (!/\d/.test(p1)) {
      return `//{roletag:${p1}}//`;
    }

    return match;
  });

  return message;
};
