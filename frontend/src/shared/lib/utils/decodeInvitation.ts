interface Invitation {
  ServerName: string;
  ServerIconId: string;
  InvitationToken: string;
}

const base64UrlToBase64 = (base64Url: Base64URLString) => {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return base64;
};

export const decodeInvitation = (encoded: Base64URLString): Invitation => {
  const base64 = base64UrlToBase64(encoded);

  const jsonStr = atob(base64);

  return JSON.parse(jsonStr);
};
