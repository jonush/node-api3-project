const express = require('express');
const morgan = require('morgan');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(express.json());
server.use(morgan(':method :url :date[web]'));
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
