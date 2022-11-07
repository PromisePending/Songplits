const cp = require('child_process');

function commandOne (server, client, messageObject) {
  // the client sucessfully uploaded the file to the server and now the server must start the song split process
  const fileIdentifier = messageObject.commandArgs.fileIdentifier;
  const file = server.backend.processFilesBuffer.find(file => file.fileIdentifier === fileIdentifier);
  if (!file) return;
  // we now have all the necessary data to start the song split process
  // we split the song spawning a new process that will call the spleeter python script
  cp.exec(`python -m spleeter separate -o ${file.folderPath}/${fileIdentifier}-converted.${file.fileExtension} -p spleeter:5stems ${file.filePath}`, (err, stdout, stderr) => {
    console.log(err, stdout, stderr);
    if (err) {
      // if the process fails we send a message to the client
      client.send(JSON.stringify({
        type: '002',
        cmd: {
          fileIdentifier: fileIdentifier,
          error: err,
        }
      }));
    } else {
      // if the process succeeds we send a message to the client
      client.send(JSON.stringify({
        type: '002',
        cmd: {
          fileIdentifier: fileIdentifier,
          stdout: stdout,
          stderr: stderr,
        }
      }));
    }
  });
}

module.exports = commandOne;