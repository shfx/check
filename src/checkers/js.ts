import { Linter, CLIEngine } from 'eslint';
import { format as prettierFormat, resolveConfig, Options } from 'prettier';

import clangFormat from 'clang-format';

import { readFile } from '../readFile';
import { writeFile } from '../writeFile';

import { Warning, Error } from './types';

export const check = async (
  file: string,
  doFix: boolean
): Promise<(Warning | Error)[]> => {
  const output: (Warning | Error)[] = [];

  let data = await readFile(file);

  if (!data) {
    return output;
  }

  const prettierConfig = await resolveConfig(file);

  const failSafeComfig: Options = {
    ...prettierConfig,
    parser: 'babel',
  };

  let formatted;

  if (prettierConfig) {
    formatted = prettierFormat(data, failSafeComfig);
  }

  formatted = clangFormat(data, 'utf8', 'file');

  if (formatted && data !== formatted) {
    if (doFix) {
      await writeFile(file, formatted);
    } else {
      output.push({
        warning: 'File should be formatted (prettier-js)',
        line: 0,
        column: 0,
      });
    }
  }

  const cli = new CLIEngine({
    fix: doFix,
    useEslintrc: true,
  });

  let msgs: Linter.LintMessage[] = [];

  if (dofix) {
    const fixedmsg = linter.verifyandfix(data, , file);
    if (!fixedmsg.fixed) {
      msgs = fixedmsg.messages;
    }
  } else {
    msgs = linter.verify(data, {}, file);
  }

  const report = cli.executeOnFiles([file]);

  if (doFix) {
    CLIEngine.outputFixes(report);
  }

  msgs = report.results[0].messages;

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
