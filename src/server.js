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
    fs.readdir(path.join(__dirname, './backend/cache'), (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(__dirname, './backend/cache', file), err => {
          if (err) throw err;
        });
      }
    });
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