import { CLIEngine, Linter } from 'eslint';
import {
  check as prettierCheck,
  format as prettierFormat,
  resolveConfig,
  Options,
} from 'prettier';
import { readFile } from '../readFile';
import { writeFile } from '../writeFile';

import { Warning, Error } from './types';

const linter = new Linter();

export const check = async (
  file: string,
  doFix: boolean
): Promise<(Warning | Error)[]> => {
  const cli = new CLIEngine({});

  const output: (Warning | Error)[] = [];
  let data = await readFile(file);

  if (!data) {
    return output;
  }

  const prettierConfig = await resolveConfig(file);
  const failSafeComfig: Options = {
    ...prettierConfig,
    parser: 'typescript',
  };

  if (prettierConfig && !prettierCheck(data, failSafeComfig)) {
    if (doFix) {
      const formated = prettierFormat(data, failSafeComfig);

      // console.log(formated);
      await writeFile(file, formated);
    } else {
      output.push({
        warning: 'File should be formatted (prettier-js)',
        line: 0,
        column: 0,
      });
    }
  }

  const config = cli.getConfigForFile(file);
  let msgs: Linter.LintMessage[] = [];

  if (doFix) {
    const fixedMsg = linter.verifyAndFix(data, config);
    if (!fixedMsg.fixed) {
      msgs = fixedMsg.messages;
    }
  } else {
    msgs = linter.verify(data, config);
  }

  return [
    ...output,
    ...msgs.map(msg => {
      if (msg.severity === 2) {
        return {
          error: `${msg.message} (${msg.ruleId})`,
          line: msg.line,
          column: msg.column,
        };
      }
      return {
        warning: msg.message,
        line: msg.line,
        column: msg.column,
      };
    }),
  ];
};
