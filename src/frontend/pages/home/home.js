document.getElementById('startSplitProcess').onclick = () => {
    document.getElementById('uploadFilePopup').classList.remove('hide');
}

document.getElementById('fileInput').onclick = () => {
    document.getElementById('fileInputElement').click();
}

[...document.getElementsByClassName('popup')].forEach((popup) => {
    popup.onclick = (e) => {
        if (e.target.classList.contains('popup')) {
            popup.classList.add('hide');
        }
    }
})

// detect the esc key and close the popup
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        [...document.getElementsByClassName('popup')].forEach((popup) => {
            popup.classList.add('hide');
        }
        )
    }
});

// https://stackoverflow.com/questions/10261989/html5-javascript-drag-and-drop-file-from-external-window-windows-explorer
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var file = files[0];
    
    handleFileSelect(file);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

document.getElementById('fileInput').addEventListener('dragover', handleDragOver, false);
document.getElementById('fileInput').addEventListener('drop', handleFileSelect, false);

// ----

function handleFileSelect(file) {
    if (!file.type.startsWith('audio')) return;

    var reader = new FileReader();
    reader.onload = (e) => {
        var data = e.target.result;
        var audio = document.createElement('audio');
        audio.src = data;
        audio.controls = true;
        document.getElementById('uploadFilePopup').appendChild(audio);
        audio.play();
    }
    reader.readAsDataURL(file);
}

document.getElementById('fileInputElement').addEventListener('change', (e) => {
    var file = e.target.files[0];
    handleFileSelect(file);
});