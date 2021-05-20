import express from 'express';
import uniqid from 'uniqid';
import multer from 'multer';
import { getAuthors, writeAuthors } from '../lib/fs-helper.js';
import { writeAvatarPicture } from '../lib/fs-helper.js';

const authorsRouter = express.Router();

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
  multer().single('avatarPicture'),
  async (req, res, next) => {
    try {
      await writeAvatarPicture(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);
authorsRouter.delete('/:id', (req, res) => {});
authorsRouter.put('/:id', (req, res) => {});

export default authorsRouter;
