import sanitizeHtml from 'sanitize-html';

export const sanitaizeMessage = (message: string) => {
  const clean = sanitizeHtml(message, {
    allowedTags: ['code', 'i', 'strong', 'a', 'br', 'p'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
    allowedClasses: {
      p: ['quoted-reply'],
    },
  });

  return clean;
};
