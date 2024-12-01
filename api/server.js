const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Lê todos os arquivos JSON dentro da pasta `biblia`
const dirPath = path.join(__dirname, 'biblia');
const routers = fs.readdirSync(dirPath).reduce((acc, file) => {
  if (file.endsWith('.json')) {
    const resourceName = path.basename(file, '.json'); // Ex.: "genesis"
    acc[`/${resourceName}`] = jsonServer.router(path.join(dirPath, file));
  }
  return acc;
}, {});

// Configura rotas dinâmicas para cada arquivo JSON
Object.entries(routers).forEach(([route, router]) => {
  server.use(route, router);
});

// Reescrita para API
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id',
  })
);

server.listen(3000, () => {
  console.log('JSON Server is running with multiple routes');
});

module.exports = server;
