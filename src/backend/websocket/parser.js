/**
 * @param {string} data
 */
function parseClientCommand(data) {
    const commandId = Number(data.slice(1, 4));

    return {
        valid: !isNaN(commandId),
        commandId: commandId,
        commandArgs: data.slice(4)
    };
}

module.exports = parseClientCommand;