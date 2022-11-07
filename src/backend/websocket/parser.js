/**
 * @param {string} data
 */
function parseClientCommand(data) {
    const messageObject = JSON.parse(data);
    const commandId = Number(messageObject.type);
    const command = messageObject.cmd;

    return {
        valid: !isNaN(commandId),
        commandId: commandId,
        commandArgs: command
    };
}

module.exports = parseClientCommand;