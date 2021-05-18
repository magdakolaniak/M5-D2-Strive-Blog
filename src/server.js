import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import authorsRouter from './authors/index.js';

const server = express();
const port = 3001;

server.use(cors());

server.use(express.json());

server.use('/authors', authorsRouter);

console.log(listEndpoints(server));
server.listen(port, () => {
  console.log('Server listening on port ', port);
});
server.on('error', (error) => console.log(`Server is not running: ${error} `));
