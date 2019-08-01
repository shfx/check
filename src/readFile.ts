import { lstat, readFile as read } from 'fs-extra';

export const readFile = async (file: string): Promise<string|null> => {
  try {
    const stats = await lstat(file);
    if (!stats.isFile()) {
      return null;
    }
    return read(file, 'utf8');
  } catch(e) {
    return null
  }
};
