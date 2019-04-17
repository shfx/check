import { lstat, writeFile as write } from 'fs-extra';

export const writeFile = async (file: string, data: string): Promise<void> => {
  const stats = await lstat(file);
  if (!stats.isFile()) {
    throw new Error('Not a file');
  }
  return write(file, data, 'utf8');
};
