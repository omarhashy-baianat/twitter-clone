import * as fs from 'fs';
import * as path from 'path';

export async function removeFile(fileName: string): Promise<boolean> {
  const filePath = path.join(process.cwd(), 'uploads', fileName);

  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${error.message}`);
    }
    return false;
  }
}
