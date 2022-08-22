const fs = require('fs');
const path = require('path');

module.exports = function(server, req, res, method) {
  if (method !== 'POST') return res.status(405).send('only POST requests are allowed');
  if (!req.query.id) return res.status(400).send('missing id');
  if (!req.query.ext) return res.status(400).send('missing file extension');
  if (!server.backend.processFilesBuffer.find(file => file.fileIdentifier === req.query.id)) return res.status(400).send('Invalid id! Are you trying to upload a file that is already uploaded? Or you didn\'t created the file yet on the websocket server?');

  clearTimeout(server.backend.processFilesBuffer.find(file => file.fileIdentifier === req.query.id).timeout);

  var audioFile = fs.createWriteStream(path.resolve(__dirname, '..', '..', 'cache', req.query.id + '.' + req.query.ext.split('.').pop()));

  audioFile.on('open', function (fd) {
    var fileFinished = false;
    req.on('data', function(data){
      audioFile.write(data);
    }); 

    req.on('close', function() {
      if (!fileFinished) {
        audioFile.end();
      }
    });

    req.on('end', function(){
      fileFinished = true;
      audioFile.end();
      res.status(200).send('File uploaded!');
      server.backend.processFilesBuffer.find(file => file.fileIdentifier === req.query.id).client.send(JSON.stringify({
        type: '1',

      }));
    });
  });
}