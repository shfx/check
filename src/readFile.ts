import { lstat, readFile as read } from 'fs-extra';

export const readFile = async (file: string): Promise<string> => {
  const stats = await lstat(file);
  if (!stats.isFile()) {
    return '';
  }
  return read(file, 'utf8');
};
