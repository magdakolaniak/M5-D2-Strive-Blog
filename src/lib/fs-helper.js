import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data');

const authorsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../public/img/authors'
);

const blogPostsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../public/img/blogPosts'
);

export const getPosts = async () =>
  await readJSON(join(dataFolderPath, 'posts.json'));
export const getAuthors = async () =>
  await readJSON(join(dataFolderPath, 'authors.json'));

export const writePosts = async (content) =>
  await writeJSON(join(dataFolderPath, 'posts.json'), content);
export const writeAuthors = async (content) =>
  await writeJSON(join(dataFolderPath, 'authors.json'), content);

export const writeAvatarPicture = async (fileName, content) =>
  await writeFile(join(authorsFolderPath, fileName), content);

export const writeCoverPicture = async (fileName, content) =>
  await writeFile(join(blogPostsPath, fileName), content);

export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile));
