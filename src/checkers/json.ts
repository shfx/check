import prettier from 'prettier';

import { readFile } from '../readFile';
import { Warning, Error } from './types';

export const check = async (
  file: string,
  _doFix: boolean
): Promise<(Warning | Error)[]> => {
  const data = await readFile(file);

  if (!prettier.check(data, { filepath: file })) {
    return [
      {
        warning: 'File should be formatted (prettier-js)',
        line: 0,
        column: 0,
      },
    ];
  }

  return [];
};
