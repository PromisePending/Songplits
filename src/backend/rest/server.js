const express = require('express');
const fs = require('fs');
const path = require('path');

class RestServer {
  constructor(backend, url) {
    this.backend = backend;
    this.url = url;
    this.commands = [];
    this.app = express();
  }

  loadCommands() {
    const commands = fs.readdirSync(path.join(__dirname, './commands'));
    console.log('loading commands...');
    commands.forEach(command => {
      const commandPath = path.join(__dirname, './commands/' + command);
      const commandModule = require(commandPath);
      console.log('loading command: ' + command.split('.')[0]);
      this.commands.push({
        name: command.split('.')[0],
        execute: commandModule,
      });
    });
  }

  /**
   * register the rest route for the app
   */
  start() {
    this.app.use('/', (req, res) => {
      const command = this.commands.find(c => c.name === req.url.split('?')[0].slice(1));
      if (command) {
        command.execute(this, req, res, req.method);
      } else {
        res.status(404).send('command not found');
      }
    });
  }
}
module.exports = RestServer;