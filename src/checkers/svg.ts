import Svgo from 'svgo';
import { readFile } from '../readFile';

import { Warning, Error } from './types';

const svgoObj = new Svgo();

const parseError = (err: string) => {
  const parsed = err.split('\n');
  return {
    error: parsed[0],
    line: Number(parsed[1].replace('Line: ', '')),
    column: Number(parsed[2].replace('Column: ', '')),
  };
};

export const check = async (
  file: string,
  _doFix: boolean
): Promise<(Warning | Error)[]> => {
  const data = await readFile(file);
  const output = [];

  try {
    const results = await svgoObj.optimize(data, { path: file });

    if (data.length >= results.data.length) {
      output.push({
        warning: `Could optimise by ${(data.length - results.data.length) /
          100}%`,
        line: 0,
        column: 0,
      });
    }
  } catch (err) {
    output.push(parseError(err));
  }

  return output;
};
