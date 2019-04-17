import * as path from 'path';

import commander from 'commander';
import notifier from 'node-notifier';

import * as checkers from '../checkers';
import { Warning, Error } from '../checkers';
import * as log from '../logging';

process.on('SIGINT', () => {
  const status = formatStats(stats);
  const total = formatTotal(stats.files);

  log.notify(`(${status}) (${total})`);
  log.fail('...interrupted', false);
  process.exit();
});

const relativePath = (file: string) => path.relative(process.cwd(), file);

type FielSet = {
  svg: Set<string>;
  img: Set<string>;
  js: Set<string>;
  ts: Set<string>;
  json: Set<string>;
  css: Set<string>;
};

let totalCount: number;

const stats = {
  errors: 0,
  warnings: 0,
  infos: 0,
  files: 0,
};

const format = (
  type: string,
  file: string,
  error: string,
  line: number,
  column: number
) => `${type} ${error} @ ${relativePath(file)}:${line}:${column}`;

type Format = {
  errors: number;
  warnings: number;
  infos: number;
};

const formatStats = ({ errors, warnings, infos }: Format): string =>
  `${String(errors).red} ${String(warnings).yellow} ${String(infos).blue}`;

const formatTotal = (files: number): string =>
  `${String(files).cyan}/${String(totalCount).cyan}`;

export const files: (
  src: string[],
  args: commander.Command
) => Promise<void> = async (src, args) => {
  const { svg, js, ts, css, json } = src.reduce(
    (acc: FielSet, value: string) => {
      if (value.endsWith('.css')) {
        acc.css.add(value);
      }
      if (value.endsWith('.svg')) {
        acc.svg.add(value);
      }
      if (value.endsWith('.js')) {
        acc.js.add(value);
      }
      if (value.endsWith('.ts') || value.endsWith('.tsx')) {
        acc.ts.add(value);
      }
      if (value.endsWith('.json')) {
        acc.json.add(value);
      }

      if (value.endsWith('.jpg') || value.endsWith('.png')) {
        acc.img.add(value);
      }
      return acc;
    },
    {
      svg: new Set(),
      img: new Set(),
      js: new Set(),
      ts: new Set(),
      json: new Set(),
      css: new Set(),
    }
  );

  totalCount = svg.size + js.size + css.size + json.size;

  log.start('Parsing ...');

  await Promise.all(
    [...svg].map(async file => {
      const output = await checkers.svg(file, args.parent.fix);
      stats.files += 1;

      if (args.parent.verbose) {
        log.notify(`Parsing ${file}`);
      }

      if (!output) {
        return;
      }

      output.forEach(output => {
        if ((<Error>output).error !== undefined) {
          stats.errors += 1;
          !args.parent.quiet &&
            log.fail(
              format(
                'SVG'.red,
                file,
                (<Error>output).error,
                output.line,
                output.column
              )
            );
        }

        if ((<Warning>output).warning) {
          stats.warnings += 1;
          !args.parent.quiet &&
            log.warn(
              format(
                'SVG'.yellow,
                file,
                (<Warning>output).warning,
                output.line,
                output.column
              )
            );
        }
      });

      const status = formatStats(stats);
      const total = formatTotal(stats.files);
      log.update(`Parsing (${status}) (${total}) ${file}`);
    })
  );

  await Promise.all(
    [...ts].map(async file => {
      const output = await checkers.ts(file, args.parent.fix);
      stats.files += 1;

      if (args.parent.verbose) {
        log.notify(`Parsing ${file}`);
      }

      if (!output) {
        return;
      }

      output.forEach(output => {
        if ((<Error>output).error !== undefined) {
          stats.errors += 1;
          !args.parent.quiet &&
            log.fail(
              format(
                'SVG'.red,
                file,
                (<Error>output).error,
                output.line,
                output.column
              )
            );
        }

        if ((<Warning>output).warning) {
          stats.warnings += 1;
          !args.parent.quiet &&
            log.warn(
              format(
                'SVG'.yellow,
                file,
                (<Warning>output).warning,
                output.line,
                output.column
              )
            );
        }
      });

      const status = formatStats(stats);
      const total = formatTotal(stats.files);
      log.update(`Parsing (${status}) (${total}) ${file}`);
    })
  );

  await Promise.all(
    [...js].map(async file => {
      const output = await checkers.js(file, args.parent.fix);
      stats.files += 1;

      if (args.parent.verbose) {
        log.notify(`Parsing ${file}`);
      }

      if (!output) {
        return;
      }

      output.forEach(output => {
        if ((<Error>output).error) {
          stats.errors += 1;
          !args.parent.quiet &&
            log.fail(
              format(
                'JS'.red,
                file,
                (<Error>output).error,
                output.line,
                output.column
              )
            );
        }

        if ((<Warning>output).warning) {
          stats.warnings += 1;
          !args.parent.quiet &&
            log.warn(
              format(
                'JS'.yellow,
                file,
                (<Warning>output).warning,
                output.line,
                output.column
              )
            );
        }
      });

      const status = formatStats(stats);
      const total = formatTotal(stats.files);
      log.update(`Parsing (${status}) (${total}) ${file}`);
    })
  );

  await Promise.all(
    [...json].map(async file => {
      const output = await checkers.json(file, args.parent.fix);
      stats.files += 1;

      if (args.parent.verbose) {
        log.notify(`Parsing ${file}`);
      }

      if (!output) {
        return;
      }

      output.forEach(output => {
        if ((<Error>output).error) {
          stats.errors += 1;
          !args.parent.quiet &&
            log.fail(
              format(
                'JSON'.red,
                file,
                (<Error>output).error,
                output.line,
                output.column
              )
            );
        }

        if ((<Warning>output).warning) {
          stats.warnings += 1;
          !args.parent.quiet &&
            log.warn(
              format(
                'JSON'.yellow,
                file,
                (<Warning>output).warning,
                output.line,
                output.column
              )
            );
        }
      });

      const status = formatStats(stats);
      const total = formatTotal(stats.files);
      log.update(`Parsing (${status}) (${total}) ${file}`);
    })
  );

  await Promise.all(
    [...css].map(async file => {
      const output = await checkers.css(file, args.parent.fix);
      stats.files += 1;

      if (args.parent.verbose) {
        log.notify(`Parsing ${file}`);
      }

      if (output === undefined) {
        return;
      }

      output.forEach(output => {
        if ((<Error>output).error) {
          stats.errors += 1;
          !args.parent.quiet &&
            log.fail(
              format(
                'CSS'.red,
                file,
                (<Error>output).error,
                output.line,
                output.column
              )
            );
        }

        if ((<Warning>output).warning) {
          stats.warnings += 1;
          !args.parent.quiet &&
            log.warn(
              format(
                'CSS'.yellow,
                file,
                (<Warning>output).warning,
                output.line,
                output.column
              )
            );
        }
      });

      const status = formatStats(stats);
      const total = formatTotal(stats.files);
      log.update(`Parsing (${status}) (${total}) ${file}`);
    })
  );

  const status = formatStats(stats);
  const total = formatTotal(stats.files);

  if (stats.errors > 0) {
    log.fail(`(${status}) (${total})`, false);
    notifier.notify({
      title: 'Check',
      message: `Errors`,
      contentImage:
        '/Users/opera_user/Downloads/_ionicons_svg_ios-close-circle.svg',
    });
    process.exit(1);
  }

  if (stats.warnings > 0) {
    log.warn(`(${status}) (${total})`, false);
    notifier.notify({
      title: 'Check',
      message: 'LGTM',
      contentImage:
        '/Users/opera_user/Downloads/_ionicons_svg_ios-checkmark-circle.svg',
    });
    return;
  }

  log.succeed(`(${status}) (${total})`, false);
};

process.on('SIGINT', () => {
  const status = formatStats(stats);
  const total = formatTotal(stats.files);

  log.notify(`(${status}) (${total})`);
  log.fail('...interrupted', false);
  process.exit();
});
