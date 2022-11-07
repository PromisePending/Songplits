const EventEmitter = require('events');
const parser = require('./parser');
const path = require('path');
const ws = require('ws');
const fs = require('fs');

class WSServer extends EventEmitter {
    constructor(backend, url) {
        super();
        this.backend = backend;
        this.url = url;
        this.commands = [];
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
        }
        );
    }

    start() {
        this.server = new ws.Server({ port: 8080, path: this.url.startsWith('/') ? this.url : '/' + this.url });

        this.server.on('connection', (data) => {this.onConnection(data);});
        this.server.on('close', () => {this.onClose();});
        this.server.on('error', (err) => {this.onError(err);});
        console.log('Websocket Server started! on ws://localhost:8080' + this.url);
    }

    onConnection(data) {
        console.log('Client connected!');
        data.on('message', (message) => {this.onClientMessage(data, message);});
        data.on('close', () => {this.onClientClose();});
        data.on('error', (error) => {this.onClientError(error);});
    }

    onClose() {
        console.log('WS Server closed!');
    }

    onError(error) {
        console.log('Ops an error: ' + error);
    }

    onClientMessage(client, message) {
        console.log(message.toString());
        const messageObject = parser(message.toString());
        if (messageObject.valid) {
            const command = this.commands.find(command => command.name === messageObject.commandId.toString());
            if (command) {
                command.execute(this, client, messageObject);
            }
        }
    }

    onClientError(err) {

    }

    onClientClose() {
        console.log('Client disconnected!');
    }
}

module.exports = WSServer;