import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import {Buffer} from 'buffer';

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('request.method', request.method);
  console.log('request.url:', request.url);
  console.log('request.headers', request.headers);

  const array = [];
  request.on('data', (chunk) => {
    array.push(chunk);
  });

  request.on('end', () => {
    const body = Buffer.concat(array).toString();
    console.log('body:', body);

    response.statusCode = 404
    response.end();
  });
});

server.listen(8888, () => {
  console.log(server.address());
});