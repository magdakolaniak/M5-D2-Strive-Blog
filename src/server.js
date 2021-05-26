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

const server = express();
const { PORT } = process.env;

const whitelist = [process.env.FRONTEND_DEV_URL];
console.log(whitelist);
// middlewares part //
const corsOptions = {
  origin: function (origin, next) {
    console.log('ORIGIN: ', origin);
    if (whitelist.indexOf(origin) !== -1) {
      // origin allowed
      next(null, true);
    } else {
      // origin not allowed
      next(new Error('CORS TROUBLES!!!!!'));
    }
  },
};
server.use(cors(corsOptions));
server.use(express.json());

server.use('/authors', authorsRouter);
server.use('/blogPosts', postsRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));
server.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
server.on('error', (error) => console.log(`Server is not running: ${error} `));
