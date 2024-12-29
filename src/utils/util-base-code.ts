export const encodeBase64 = (text: string) => {
  return btoa(unescape(encodeURIComponent(text)));
};

export const decodeBase64 = (text: string) => {
  return decodeURIComponent(escape(atob(text)));
};
