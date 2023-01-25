import { readFile, writeFile } from 'fs/promises';

export async function readJSONFromDisk(fileURL) {
  const contentsString = await readFile(fileURL, { encoding: 'utf8' });
  return JSON.parse(contentsString);
}

export async function writeJSONToDisk(filename, data) {
  await writeFile(filename, JSON.stringify(data, null, 2));
}

export async function writeTextToDisk(filename, data) {
  await writeFile(filename, data);
}