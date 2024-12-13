import { IResponse } from 'src/interceptors/IResponse';

export const isIResponse = (obj: any): obj is IResponse => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    obj.data &&
    'message' in obj &&
    obj.message
  );
};
