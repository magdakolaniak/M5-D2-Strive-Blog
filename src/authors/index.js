import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import uniqid from 'uniqid';

const router = express.Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const authorsFilePath = path.join(_dirname, 'authors.json');

router.get('/', (req, res) => {
  const fileAsBuffer = fs.readFileSync(authorsFilePath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJSON = JSON.parse(fileAsString);
  res.send(fileAsJSON);
});
router.get('/:id', (req, res) => {
  const fileAsBuffer = fs.readFileSync(authorsFilePath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJSON = JSON.parse(fileAsString);
  const author = fileAsJSON.find((author) => author.id === req.params.id);
  if (!author) {
    res
      .status(404)
      .send({ message: `Author with ID ${req.params.id} is not there` });
  }
  res.send(author);
});
router.post('/', (req, res) => {
  const { name, surname, email, dateOfBirth } = req.body;
  const author = {
    id: uniqid(),
    name,
    surname,
    email,
    dateOfBirth,
    avatar: `https://ui-avatars.com/api/?name=${surname}`,
    createdAt: new Date(),
  };

  const fileAsBuffer = fs.readFileSync(authorsFilePath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsArray = JSON.parse(fileAsString);
  fileAsArray.push(author);
  fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsArray));
  res.send(author);
});
router.delete('/:id', (req, res) => {
  const fileAsBuffer = fs.readFileSync(authorsFilePath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJSON = JSON.parse(fileAsString);

  const remainingAuthors = fileAsJSON.filter(
    (author) => author.id !== req.params.id
  );

  fs.writeFileSync(authorsFilePath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});
router.put('/:id', (req, res) => {
  const fileAsBuffer = fs.readFileSync(authorsFilePath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJSON = JSON.parse(fileAsString);

  const remainingAuthors = fileAsJSON.filter(
    (author) => author.id !== req.params.id
  );
  const updatedAuthor = {
    id: req.params.id,

    ...req.body,
  };
  remainingAuthors.push(updatedAuthor);
  fs.writeFileSync(authorsFilePath, JSON.stringify(remainingAuthors));

  res.send(updatedAuthor);
});

export default router;
