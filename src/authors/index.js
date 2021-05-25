import express from 'express';
import uniqid from 'uniqid';

import { extname } from 'path';
import multer from 'multer';
import { getAuthors, writeAuthors } from '../lib/fs-helper.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const authorsRouter = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Strive-Blog/Avatars',
  },
});

authorsRouter.get('/', async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    next();
  }
});

authorsRouter.get('/:id', async (req, res, next) => {
  try {
    const authors = await getAuthors();

    const author = authors.find((author) => author.id === req.params.id);
    res.send(author);
  } catch (error) {
    next(error);
  }
});
authorsRouter.post('/', async (req, res, next) => {
  try {
    const newAuthor = { id: uniqid(), ...req.body, createdAt: newDate() };
    const authors = await getAuthors();

    authors.push(newAuthor);
    await writeAuthors(authors);
    res.status(201).send({ id: newAuthor.id });
  } catch (error) {
    next(error);
  }
});
authorsRouter.post(
  '/:id/uploadAvatar',
  multer({ storage: cloudinaryStorage }).single('avatarPicture'),
  async (req, res, next) => {
    try {
      const authors = await getAuthors();
      const author = authors.find((author) => author.id === req.params.id);
      author.avatar = `${req.file.path}`;
      const remainingAuthors = authors.filter(
        (author) => author.id !== req.params.id
      );

      remainingAuthors.push(author);

      await writeAuthors(remainingAuthors);
      res.send(author);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
authorsRouter.delete('/:id', (req, res) => {});
authorsRouter.put('/:id', (req, res) => {});

export default authorsRouter;
