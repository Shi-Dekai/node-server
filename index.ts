import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');
let cacheAge = 3600 * 24 * 365;

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('request.method', request.method);
  console.log('request.url:', request.url);
  console.log('request.headers', request.headers);
  const {method, url: path, headers} = request;
  if (method !== 'GET') {
    response.statusCode = 405;
    response.end();
    return;
  }

  const {pathname, search} = url.parse(path);
  let fileName = pathname.substr(1);
  if (fileName === '') {
    fileName = 'index.html';
  }
  fs.readFile(p.resolve(publicDir, fileName), (error, data) => {
    if (error) {
      response.setHeader('Content-Type', 'text/html; charset=utf-8;');
      if (error.errno === -4058) {
        response.statusCode = 404;
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data);
        });
      } else if (error.errno === -4068) {
        response.statusCode = 403;
        response.end('无权查看目录内容');
      } else {
        response.statusCode = 500;
        response.end('服务器繁忙,请稍后重试!');
      }
    } else {
      //添加缓存
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`);
      // 返回文件内容
      response.end(data);
    }
  });
});

server.listen(8888);