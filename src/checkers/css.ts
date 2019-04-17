import * as stylelint from 'stylelint';

import { Warning, Error } from './types';

export const check = async (
  file: string,
  doFix: boolean
): Promise<(Warning | Error)[]> => {
  const msgs = await stylelint.lint({
    fix: doFix,
    files: file,
  });

  if (!msgs.results || !msgs.results[0]) {
    return [];
  }

  type FixType = {
    line: number;
    column: number;
    rule: string;
    severity: 'error' | 'warning';
    text: string;
  };

  return msgs.results[0].warnings.reduce((acc: (Warning | Error)[], msg) => {
    const fixedMsg = (msg as unknown) as FixType;

    if (fixedMsg.severity === 'error') {
      return [
        ...acc,
        {
          error: fixedMsg.text,
          line: fixedMsg.line,
          column: fixedMsg.column,
        },
      ];
    }
    if (fixedMsg.severity === 'warning') {
      return [
        ...acc,
        {
          warning: fixedMsg.text,
          line: fixedMsg.line,
          column: fixedMsg.column,
        },
      ];
    }

    return acc;
  }, []);
};
