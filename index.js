const app = require('express')();

const Client = require('./src/client');
const Server = require('./src/server');

const server = new Server('/backend/ws');

const client = new Client();

app.use('/backend', server.restServer.app);
app.use('/', client.app);

server.start();
client.load();
client.init();

app.listen(3000, () => {
    console.log('App Server started!');
});