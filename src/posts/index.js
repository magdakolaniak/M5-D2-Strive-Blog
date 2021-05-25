import express from 'express';

import { getPosts, writePosts } from '../lib/fs-helper.js';

import uniqid from 'uniqid';
import { validationResult } from 'express-validator';
import createError from 'http-errors';

import { postValidation } from './validation.js';

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const postsRouter = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Strive-Blog/Covers',
  },
});

postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.get('/:id', async (req, res, next) => {
  try {
    const posts = await getPosts();
    const post = posts.find((post) => post._id === req.params.id);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

postsRouter.post('/', postValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400, { errorList: errors }));
    } else {
      const posts = await getPosts();
      const newPost = { _id: uniqid(), ...req.body, createdAt: new Date() };
      posts.push(newPost);
      await writePosts(posts);

      res.status(201).send({ id: newPost._id });
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.post(
  '/:id/uploadCover',
  multer({ storage: cloudinaryStorage }).single('coverPicture'),
  async (req, res, next) => {
    try {
      const posts = await getPosts();
      const post = posts.find((post) => post._id === req.params.id);
      post.cover = `${req.file.path}`;
      const remainingPosts = posts.filter((post) => post._id !== req.params.id);
      remainingPosts.push(post);
      await writePosts(remainingPosts);
      res.send(post);
    } catch (error) {
      next(error);
    }
  }
);

postsRouter.put('/:id', async (req, res, next) => {
  try {
    const posts = await getPosts();
    const newPosts = posts.filter((post) => post._id !== req.params.id);
    const modifiedPost = {
      ...req.body,
      id: req.params.id,
      modifiedAt: new Date(),
    };
    newPosts.push(modifiedPost);

    await writePosts(newPosts);
    res.send(modifiedPost);
  } catch (error) {
    next(error);
  }
});
postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const posts = await getPosts();
    const remainingPosts = posts.filter((post) => post._id !== req.params.id);
    await writePosts(remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default postsRouter;
