const WSServer = require('./backend/websocket/server');
const RestServer = require('./backend/rest/server');
const fs = require('fs');
const path = require('path');

class Server {
  constructor(url) {
    this.url = url;
    this.restServer = new RestServer(this, this.url);
    this.WSServer = new WSServer(this, this.url);
    this.processFilesBuffer = [];
    // cleans the cache folder
    if (fs.existsSync(path.join(__dirname, './backend/cache'))) {
      fs.rmSync(path.join(__dirname, './backend/cache'), { recursive: true });
    }
    fs.mkdirSync(path.join(__dirname, './backend/cache'));
    console.log('Backend Server created!');
  }

  start() {
    this.WSServer.loadCommands();
    this.restServer.loadCommands();
    this.WSServer.start();
    this.restServer.start();
    console.log('Backend Server started!');
  }
}

module.exports = Server;