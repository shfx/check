import { resolve } from 'path';
import program, { Command } from 'commander';
import child_process from 'child_process';
import util from 'util';

const exec = util.promisify(child_process.exec);

import 'colors';

const absolutePath = (file: string) => resolve(process.cwd(), file);

program
  .name('check')
  .version('0.0.1', '-V, --version')
  .option(
    '-v, --verbose',
    'verbose mode, prints all files that are being parsed.'
  )
  .option('-s, --quiet', 'quiet mode, only prints end results.')
  .option('--fix', 'fix possible issues.');

program.command('setup', 'setup local git repository with pre-commit hooks');

program
  .command('files [files...]')
  .description('validates listed files')
  .action(async (list: string[], args: Command) => {
    const { files } = await import('./cli/files');
    files(list.map(absolutePath), args);
  });

const gitListStaged =
  "git status --no-renames --porcelain --untracked-files=no | grep -e '^M' -e '^ M' -e '^A' | awk '{print $2}'";

program
  .command('staged', undefined, { isDefault: true })
  .description('validates staged files')
  .action(async (args: Command) => {
    const { files } = await import('./cli/files');

    const { stdout: staged } = await exec(gitListStaged);

    files([...staged.split('\n')].map(absolutePath), args);
  });

program
  .command('print-staged', undefined, { isDefault: true })
  .description('print files that will be validated by `staged` command')
  .action(async () => {
    const { stdout: staged } = await exec(gitListStaged);
    console.log(staged);
  });

program.parse(process.argv);

export { program };

// process.on('unhandledRejection', (reason, p) => {
//   log.fail(`Possibly Unhandled Rejection at: reason: ${reason}`);
//   console.log(reason, p);
//   // application specific logging here
// });
