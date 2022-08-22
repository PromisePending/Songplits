function commandZero (server, client, messageObject) {
  // a client just asked for the server to start a new song split process and its waiting the server to return data to start uploading the song to the right endpoint
  // the server will create an identifier for the file and return it to the client so that the client can upload the file to the right endpoint
  const fileIdentifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const message = {
    type: '0',
    fileIdentifier: fileIdentifier,
  };
  client.send(JSON.stringify(message));

  const timeout = setTimeout(() => {
    // removes the fileIdentifier from the server's processFilesBuffer if the client didn't send a message to the server within the timeout
    server.backend.processFilesBuffer.splice(server.backend.processFilesBuffer.findIndex(file => file.fileIdentifier === fileIdentifier), 1);
  }, 60000);

  // now the rest server must wait for the client to upload the file with the fileIdentifier to the right endpoint
  server.backend.processFilesBuffer.push({
    fileIdentifier: fileIdentifier,
    client: client,
    timeout: timeout,
  });
}

module.exports = commandZero;