var fileToSplit = null;

const waveManager = generateLandingPageBGWaves();
waveManager.startAnimating();

const spinningWheel = drawSpinningWheel();

const serverConnection = new ServerConnection('ws:localhost:8080/backend/ws');

const popupHandler = new PopupHandler({
  waveManager: waveManager,
});

popupHandler.switchFileInputToState('fileUpload');

document.getElementById('startSplitProcess').onclick = () => {
  popupHandler.switchFileInputToState('fileUpload');
  popupHandler.showPopup('uploadFilePopup');
}

document.getElementById('fileInput').onclick = () => {
  document.getElementById('fileInputElement').click();
}

[...document.getElementsByClassName('popup')].forEach((popup) => {
  popup.onclick = (e) => {
    if (e.target.classList.contains('popup')) {
      popupHandler.closePopup(e.target.id);
    }
  }
});

// detect the esc key and close the popup
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    popupHandler.closePopup(popupHandler.openedPopups[popupHandler.openedPopups.length - 1]);
  }
});

function handleFileSelectElement(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (ev.dataTransfer.items) {
    if (ev.dataTransfer.items[0].kind === 'file') {
      var file = ev.dataTransfer.items[0].getAsFile();
      handleFileSelect(file);
    }
  }
  
  return false;
}

function handleDragOver(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  evt.dataTransfer.dropEffect = 'copy';
  document.getElementById('fileInput').classList.add('dragging');
  return false;
}

function cancelDefaultDrops(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function resetAnimationState(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('fileInput').classList.remove('dragging');
  return false;
}

document.getElementById('uploadFilePopup').ondragover = handleDragOver;
document.getElementById('uploadFilePopup').ondrop = handleFileSelectElement;
document.getElementById('uploadFilePopup').ondragleave = resetAnimationState;
document.getElementById('uploadFilePopup').ondragenter = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondragstart = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondragend = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondrag = cancelDefaultDrops;

function handleFileSelect(file) {
  document.getElementById('fileInput').classList.remove('dragging');
  if (!file.type.startsWith('audio')) return;
  
  popupHandler.switchFileInputToState('fileSelection');

  var JSMediaTags = window.jsmediatags;
  JSMediaTags.read(file, {
    onSuccess: function(tag) {
      var imageUrl = null;
      if (tag.tags.picture) {
        var imageAmount = Math.floor(tag.tags.picture.data.length / 500000);
        var imageAmountRest = tag.tags.picture.data.length % 500000;
        var imageResult = [];
        for (var i = 0; i < imageAmount; i++) {
          imageResult.push(String.fromCharCode.apply(null, new Uint8Array(tag.tags.picture.data.slice(i * 500000, (i + 1) * 500000))));
        }
        if (imageAmountRest > 0) {
          imageResult.push(String.fromCharCode.apply(null, new Uint8Array(tag.tags.picture.data.slice((imageAmount * 500000)))));
        }
        imageUrl = 'data:' + tag.tags.picture.format + ';base64,' + btoa(imageResult.join(''));
      }

      document.getElementById('FileSelection-SelectedFile-Preview-Image-Image').src = imageUrl || './assets/NoPictureAvailable.svg';
      document.getElementById('FileSelection-SelectedFile-Info-Title').innerText = tag.tags.title || file.name;
      document.getElementById('FileSelection-SelectedFile-Info-Artist').innerText = tag.tags.artist || 'Unknown Artist';
    },
    onError: function(error) {
      document.getElementById('FileSelection-SelectedFile-Preview-Image-Image').src = './assets/NoPictureAvailable.svg';
      document.getElementById('FileSelection-SelectedFile-Info-Title').innerText = file.name;
      document.getElementById('FileSelection-SelectedFile-Info-Artist').innerText = 'Unknown Artist';
      console.error(error);
    }
  });

  fileToSplit = file;
}

document.getElementById('FileSelection-Buttons-GoBack').onclick = () => {
  popupHandler.switchFileInputToState('fileUpload');
}

document.getElementById('fileInputElement').addEventListener('change', (e) => {
  var file = e.target.files[0];
  handleFileSelect(file);
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})(([a-f\d]{2})?)$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: isNaN(parseInt(result[4], 16)) ? 255 : parseInt(result[4], 16)
  } : null;
}

function rgbToHex(r, g, b, a) {
  typeof a !== 'number' ? a = 255 : null;
  var result = '#' +
    (parseInt(r).toString(16).length === 1 ? '0' + parseInt(r).toString(16) : parseInt(r).toString(16)) +
    (parseInt(g).toString(16).length === 1 ? '0' + parseInt(g).toString(16) : parseInt(g).toString(16)) +
    (parseInt(b).toString(16).length === 1 ? '0' + parseInt(b).toString(16) : parseInt(b).toString(16)) +
    (parseInt(a).toString(16).length === 1 ? '0' + parseInt(a).toString(16) : parseInt(a).toString(16));
  return result;
}

const transitionIntervals = [];
function transitionHexColors(id, callback, hexColor1, hexColor2, Fps, Time) {
  const alreadyExists = transitionIntervals.find(x => x.id === id);
  if (alreadyExists) {
    clearInterval(alreadyExists.interval);
    transitionIntervals.splice(transitionIntervals.indexOf(alreadyExists), 1);
  }
  const fps = Fps || 60;
  const time = Time || 1000;
  
  // convert hex colors to rgb
  const rgbColor1 = hexToRgb(hexColor1);
  const rgbColor2 = hexToRgb(hexColor2);

  // calculate the difference between the two colors
  const rDiff = rgbColor2.r - rgbColor1.r;
  const gDiff = rgbColor2.g - rgbColor1.g;
  const bDiff = rgbColor2.b - rgbColor1.b;
  const aDiff = rgbColor2.a - rgbColor1.a;

  // calculate the number of frames needed to transition the colors
  const numFrames = Math.round(time / (1000 / fps));
  const rStep = rDiff / numFrames;
  const gStep = gDiff / numFrames;
  const bStep = bDiff / numFrames;
  const aStep = aDiff / numFrames;
  const colorStep = {
    r: rStep,
    g: gStep,
    b: bStep,
    a: aStep,
  };
  const color = {
    r: rgbColor1.r,
    g: rgbColor1.g,
    b: rgbColor1.b,
    a: rgbColor1.a
  };
  const colorArray = [];
  for (var i = 0; i < numFrames; i++) {
    colorArray.push(rgbToHex(Math.round(color.r), Math.round(color.g), Math.round(color.b), Math.round(color.a)));
    color.r += colorStep.r;
    color.g += colorStep.g;
    color.b += colorStep.b;
    color.a += colorStep.a;
  }
  const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const transitionInterval = setInterval(() => {
    if (colorArray.length > 0) {
      callback(colorArray.shift());
    } else {
      clearInterval(transitionInterval);
      const index = transitionIntervals.findIndex(x => x.uuid === uuid);
      if (index > -1) {
        transitionIntervals.splice(index, 1);
      }
    }
  } , 1000 / fps);

  transitionIntervals.push({
    id: id,
    uuid: uuid,
    interval: transitionInterval,
  });
}

function transitionRootGradient(property, newValue, fps, time) {
  transitionHexColors(property, (color) => {
    document.documentElement.style.setProperty(property, color);
  }, document.documentElement.style.getPropertyValue(property) || '#000000', newValue, fps, time);
}

function switchFromFileReviewToFileUpload() {
  popupHandler.switchFileInputToState('serverConnection');
  serverConnection.start();
  spinningWheel.startAnimating();

  document.documentElement.style.setProperty('--orange-gradient-background-color-1', '#ff6f36c6');
  document.documentElement.style.setProperty('--orange-gradient-background-color-2', '#a42eff3d');

  spinningWheel.parameters.color = '#FFFFFF';

  document.getElementById('serverConnection-screen-content-title').innerText = 'Connecting to server';
}
document.getElementById('FileSelection-Buttons-SplitSong').onclick = switchFromFileReviewToFileUpload;

serverConnection.addEventListener('serverConnectionOpen', () => {
  transitionRootGradient('--orange-gradient-background-color-1', '#36ff36c6', 60, 2000);
  transitionRootGradient('--orange-gradient-background-color-2', '#a4Fe4f3d', 60, 2000);

  transitionHexColors('spinningWheel', (color) => {
    spinningWheel.parameters.color = color;
  }, spinningWheel.parameters.color, '#AAFFAA', 60, 2000);

  document.getElementById('serverConnection-screen-content-title').innerText = 'Preparing for upload';
  document.getElementById('serverConnection-screen-content-progress-text').innerText = 'Loading...';
  
  serverConnection.send('>000'); // sends a initial message to the server to get the server's to start connection
});

serverConnection.addEventListener('serverConnectionMessage', (data) => {
  const cmd = JSON.parse(data.detail);
  commandsList[cmd.type] ? commandsList[cmd.type]({
    cmd,
    fileToSplit,
    spinningWheel,
    progressText: document.getElementById('serverConnection-screen-content-progress-text'),
    progressTitle: document.getElementById('serverConnection-screen-content-title'),
  }) : console.warn('Command not found: ' + cmd.type + '. This could mean that the client is in a different version than the server.');
});

serverConnection.addEventListener('serverConnectionClose', () => {
  console.log('Server connection closed!');
  transitionRootGradient('--orange-gradient-background-color-1', '#ff3636c6', 60, 500);
  transitionRootGradient('--orange-gradient-background-color-2', '#FF2e663d', 60, 500);

  transitionHexColors('spinningWheel', (color) => {
    spinningWheel.parameters.color = color;
  }, spinningWheel.parameters.color, '#FF7777', 60, 500);

  document.getElementById('serverConnection-screen-content-title').innerText = 'Server connection closed';
  document.getElementById('serverConnection-screen-content-progress-text').innerText = 'Reconnecting... (Attempt ' + (serverConnection.reconnectAttempts + 1) + ' / ' + serverConnection.maxReconnectAttempts + ')';
});

function closeUploadPopup() {
  closeFileInput();
  [...document.getElementsByClassName('popup')].forEach(x => x.classList.add('forceHide'));
  serverConnection.stop();
}