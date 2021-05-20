import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';

import authorsRouter from './authors/index.js';
import postsRouter from './posts/index.js';
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  catchAllErrorHandler,
} from './errorsHandler.js';
import { getCurrentFolderPath } from './lib/fs-helper.js';
import { join } from 'path';

const server = express();
const port = 3001;

const publicFolderPath = join(
  getCurrentFolderPath(import.meta.url),
  '../public'
);
console.log(publicFolderPath);
// middlewares part //
server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use('/authors', authorsRouter);
server.use('/blogPosts', postsRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log('Server listening on port ', port);
});
server.on('error', (error) => console.log(`Server is not running: ${error} `));
