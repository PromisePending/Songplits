const commandsList = {
  '0': uploadFile,
  '1': stateChange1,
}

function uploadFile(data) {
  if (!data.fileToSplit) return displayErrorPopup('No file selected! Are you messing with the websocket server?');

  const fileIdentifier = data.cmd.fileIdentifier;
  const fileExtension = data.fileToSplit.name.split('.').pop();

  const xhr = new XMLHttpRequest();
  new Promise((resolve) => {
    transitionRootGradient('--orange-gradient-background-color-2', '#a4aeFF3d', 60, 2000);
    data.progressTitle.innerText = 'Uploading file';
    data.spinningWheel.setMode('progress');
    data.progressText.innerText = '0%';
    data.spinningWheel.setProgress(0);
    transitionHexColors('spinningWheel', (color) => {
      spinningWheel.parameters.color = color;
    }, spinningWheel.parameters.color, '#AAFAFF', 60, 2000);
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        data.spinningWheel.setProgress(percentage);
        data.progressText.innerText = `${percentage}%`;
      }
    });
    xhr.addEventListener("loadend", () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data.spinningWheel.setMode('default');
        data.progressText.innerText = 'Done';
        data.progressTitle.innerText = 'File Uploaded!';
        transitionRootGradient('--orange-gradient-background-color-1', '#a4aeFF3d', 60, 2000);
        transitionHexColors('spinningWheel', (color) => {
          spinningWheel.parameters.color = color;
        }, spinningWheel.parameters.color, '#AAAAFF', 60, 2000);
        resolve(true);
      }
      resolve(false);
    });
    xhr.addEventListener("error", () => {
      displayErrorPopup('Error uploading file! Did you lose internet connection?');
      xhr.abort();
      resolve(false);
    });
    xhr.open("POST", `${window.location.origin}/backend/uploadSong?id=${fileIdentifier}&ext=${fileExtension}`, true);
    xhr.setRequestHeader("Content-Type", data.fileToSplit.type);
    xhr.send(data.fileToSplit);
  });
}

function stateChange1(data) {

}