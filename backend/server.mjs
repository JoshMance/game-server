import { createServer } from 'node:http';
import  path from 'node:path';
import fs from 'node:fs';

const hostname = '127.0.0.1';
const port = 3000;

const endpoints = {
  '/' : { filepath: '../frontend/index.html', contentType: 'text/html' },
  '/styles.css' : { filepath: '../frontend/src/styles.css', contentType: 'text/css' },
  '/jquery' : { filepath: '../frontend/lib/jquery-3.7.1.js', contentType: 'application/javascript' },
  '/main.js' : { filepath: '../frontend/main.js', contentType: 'application/javascript' },
  '/play.js' : { filepath: '../frontend/play.js', contentType: 'application/javascript' },
};


const server = createServer((req, res) => {

  const { method, url } = req;
  const { headers } = req;
  const userAgent = headers['user-agent'];

  const endpoint = endpoints[url];


  if (endpoint) {

    fs.readFile(endpoint.filepath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server Error');
        return;
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type',  endpoint.contentType);
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not Found');
    return;
  }

});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
