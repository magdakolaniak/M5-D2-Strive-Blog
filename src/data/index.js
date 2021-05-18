import express from 'express';
import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const routes = express.Router();
const filePath = fileURLToPath(import.meta.url);
const dirPath = dirname(filePath);
// const postsFilePath = path.join(dirPath, 'posts.json');
const authorsFilePath = path.join(dirPath, 'authors.json');

// const postsBufferFile = fs.readFileSync(postsFilePath);
// const postsStringFile = postsBufferFile.toString();
// const postsArray = JSON.parse(postsStringFile);

const authorsBufferFile = fs.readFileSync(authorsFilePath);
const authorsStringFile = authorsBufferFile.toString();
const authorsArray = JSON.parse(authorsStringFile);

routes.get('/', (req, res) => {
  //   const authorsArray = postsArray.map((author) => post.author.name);
  res.send(authorsArray);
});

// routes.get('/:id', (req, res) => {
//   console.log(req.params);
//   const author = postsArray.find((a) => a._id === req.params.id);
//   res.send(author);
// });
routes.post('/', (req, res) => {
  const newAuthor = { ...req.body, _id: uniqid() };
  console.log(req.params);
  const authors = JSON.parse(fs.readFileSync(authorsFilePath).toString());

  authors.push(newAuthor);

  fs.writeFileSync(authorsFilePath, JSON.stringify(authors));

  res.status(201).send(newAuthor._id);
});

export default routes;
