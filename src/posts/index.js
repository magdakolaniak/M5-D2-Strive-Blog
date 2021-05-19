import express from 'express';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import uniqid from 'uniqid';
import { validationResult } from 'express-validator';
import createError from 'http-errors';

import { postValidation } from './validation.js';

const postsRouter = express.Router();

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'posts.json'
);

const getPosts = () => {
  const content = fs.readFileSync(postsJSONPath);
  return JSON.parse(content);
};
const writePosts = (content) =>
  fs.writeFileSync(postsJSONPath, JSON.stringify(content));

postsRouter.get('/', (req, res, next) => {
  try {
    const posts = getPosts();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.get('/:id', (req, res, next) => {
  try {
    const posts = getPosts();
    const post = posts.find((post) => post._id === req.params.id);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

postsRouter.post('/', postValidation, (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400, { errorList: errors }));
    } else {
      const posts = getPosts();
      const newPost = { _id: uniqid(), ...req.body, createdAt: new Date() };
      posts.push(newPost);
      writePosts(posts);

      res.status(201).send({ id: newPost._id });
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.put('/:id', (req, res, next) => {
  try {
    const posts = getPosts();
    const newPosts = posts.filter((post) => post._id !== req.params.id);
    const modifiedPost = {
      ...req.body,
      id: req.params.id,
      modifiedAt: new Date(),
    };
    newPosts.push(modifiedPost);

    writePosts(newPosts);
    res.send(modifiedPost);
  } catch (error) {
    next(error);
  }
});
postsRouter.delete('/:id', (req, res, next) => {
  try {
    const posts = getPosts();
    const remainingPosts = posts.filter((post) => post._id !== req.params.id);
    writePosts(remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default postsRouter;
