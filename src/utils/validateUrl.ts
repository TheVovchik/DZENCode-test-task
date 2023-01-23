import validUrl from 'valid-url';

export const validateUrl = (data: string) => {
  let isValid = true;

  if (data.length !== 0) {
    isValid = !!validUrl.isUri(data);
  }

  return isValid;
};
