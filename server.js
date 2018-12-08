// dependencies

const http = require ('http');

const app = require('./app');

// initialize the port

const port = 3000;

// start the server

const server = http.createServer(app);

server.listen(port);
