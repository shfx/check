import ora, { Ora } from 'ora';

let spinner: Ora;

export const start = (msg: string) => {
  spinner = ora(msg).start();
};

export const stop = () => {
  spinner.info(spinner.text);
  spinner.stop();
};

export const update = (msg: string) => {
  spinner.text = msg;
};

export const notify = (msg: string, cont = true) => {
  const oldMsg = spinner.text;
  // spinner.color = "yellow";
  spinner.info(msg);
  if (!cont) {
    return;
  }
  spinner.start(oldMsg);
};

export const fail = (msg: string, cont = true) => {
  const oldMsg = spinner.text;
  // spinner.color = "red";
  spinner.fail(msg);
  if (!cont) {
    return;
  }
  spinner.start(oldMsg);
};

export const succeed = (msg: string, cont = true) => {
  const oldMsg = spinner.text;
  // spinner.color = "green";
  spinner.succeed(msg);
  if (!cont) {
    return;
  }
  spinner.start(oldMsg);
};

export const warn = (msg: string, cont = true) => {
  const oldMsg = spinner.text;
  spinner.warn(msg);
  if (!cont) {
    return;
  }
  spinner.start(oldMsg);
};
