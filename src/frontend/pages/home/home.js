const waveManager = generateLandingPageBGWaves();
waveManager.startAnimating();

const serverConnection = new ServerConnection();

document.getElementById('startSplitProcess').onclick = () => {
    showFileInput();
}

document.getElementById('fileInput').onclick = () => {
    document.getElementById('fileInputElement').click();
}

[...document.getElementsByClassName('popup')].forEach((popup) => {
    popup.onclick = (e) => {
        if (e.target.classList.contains('popup')) {
            popup.classList.add('hide');
            closeFileInput();
        }
    }
})

// detect the esc key and close the popup
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        [...document.getElementsByClassName('popup')].forEach((popup) => {
            popup.classList.add('hide');
            closeFileInput();
        });
    }
});

function showFileInput() {
    document.getElementById('uploadFilePopup').classList.remove('hide');
    document.getElementById('uploadFilePopup').classList.remove('disabled');
    document.getElementById('fileInput').classList.remove('disabled');
    document.getElementById('fileInput').style.scale = '1';
    document.getElementById('fileInput').style.position = 'static';
    document.getElementById('FileSelection').classList.add('forceHide');
    document.getElementById('FileSelection').classList.add('disabled');
    document.getElementById('serverConnection-screen').classList.add('forceHide');
    document.getElementById('serverConnection-screen').classList.add('disabled');
    waveManager.stopAnimating();
}

function switchToFileReview() {
    document.getElementById('fileInput').style.scale = '0';
    document.getElementById('fileInput').style.position = 'fixed';
    setTimeout(() => {
        document.getElementById('fileInput').classList.add('disabled');
    }, 500);
    document.getElementById('FileSelection').classList.remove('forceHide');
    document.getElementById('FileSelection').classList.remove('disabled');
}

function closeFileInput() {
    document.getElementById('fileInput').style.scale = '0';
    document.getElementById('fileInput').classList.remove('disabled');
    waveManager.startAnimating();
}

function handleFileSelect(ev) {
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
document.getElementById('uploadFilePopup').ondrop = handleFileSelect;
document.getElementById('uploadFilePopup').ondragleave = resetAnimationState;
document.getElementById('uploadFilePopup').ondragenter = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondragstart = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondragend = cancelDefaultDrops;
document.getElementById('uploadFilePopup').ondrag = cancelDefaultDrops;

function handleFileSelect(file) {
  if (!file.type.startsWith('audio')) return;
  
  switchToFileReview();

  var JSMediaTags = window.jsmediatags;
  JSMediaTags.read(file, {
    onSuccess: function(tag) {
      console.debug(tag);
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
}

document.getElementById('FileSelection-Buttons-GoBack').onclick = () => {
  showFileInput();
}

document.getElementById('fileInputElement').addEventListener('change', (e) => {
    var file = e.target.files[0];
    handleFileSelect(file);
});

function switchFromFileReviewToFileUpload() {
  document.getElementById('FileSelection').classList.add('forceHide');
  setTimeout(() => {
    document.getElementById('FileSelection').classList.add('disabled');
    document.getElementById('serverConnection-screen').classList.remove('forceHide');
  }, 500);
  document.getElementById('serverConnection-screen').classList.remove('disabled');
}
document.getElementById('FileSelection-Buttons-SplitSong').onclick = switchFromFileReviewToFileUpload;

serverConnection.on('serverConnectionMessage', (detail) => {
  if (detail === 'connected') {
    switchFromFileReviewToFileUpload();
  }
});