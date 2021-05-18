import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import routes from './data/index.js';

const server = express();

const port = 3002;

server.use(cors());
server.use(express.json());

server.use('/authors', routes);

console.log(listEndpoints(server));

server.listen(port, () => {
  console.log('Server is running on port: ', port);
});
