class PopupHandler {
  constructor(page) {
    this.page = page;
    this.openedPopups = [];

    this.waveManager = this.page.waveManager;
  }

  ///////////////////////////
  // Popups - General

  validateAnimation() {
    this.openedPopups.length > 0 ? this.waveManager.stopAnimating() : this.waveManager.startAnimating();
  }

  closePopup(id, callback) {
    if (this.openedPopups.indexOf(id) === -1) return;
    document.getElementById(id).classList.add('forceHide');
    setTimeout(() => {
      document.getElementById(id).classList.add('disabled');
      callback ? callback() : null;
    }, 500);
    this.openedPopups.splice(this.openedPopups.indexOf(id), 1);
    this.validateAnimation();
  }

  showPopup(id) {
    if (this.openedPopups.indexOf(id) !== -1) return;
    document.getElementById(id).classList.remove('disabled');
    document.getElementById(id).classList.remove('forceHide');
    this.openedPopups.push(id);
    this.validateAnimation();
  }

  disablePopupFeature(id) {
    setTimeout(() => {
      document.getElementById(id).classList.add('disabled');
    }, 500);
  }

  generatePopup(kind, ...args) {
    const popupTypes = {
      error: this.createErrorPopup.bind(this),
    };

    popupTypes[kind](...args);
  }

  ///////////////////////////
  // FileInput

  showFileInputFileUpload(state) {
    const FI = document.getElementById('fileInput');
    state ? FI.classList.remove('disabled') : this.disablePopupFeature('fileInput');
    FI.style.scale = state ? '1' : '0';
    FI.style.position = state ? 'static' :'fixed';
  }

  showFileInputFileSelection(state) {
    const FS = document.getElementById('FileSelection');
    state ? FS.classList.remove('disabled') : this.disablePopupFeature('FileSelection');
    state ? FS.classList.remove('forceHide') : FS.classList.add('forceHide');
  }

  showFileInputServerConnection(state) {
    const SC = document.getElementById('serverConnection-screen');
    state ? SC.classList.remove('disabled') : this.disablePopupFeature('serverConnection-screen');
    state ? SC.classList.remove('forceHide') : SC.classList.add('forceHide');
  }

  showFileInput() {
    showPopup('uploadFilePopup');
    switchFileInputToState('fileUpload');
  }

  switchFileInputToState(state) {
    const states = {
      fileUpload: this.showFileInputFileUpload.bind(this),
      fileSelection: this.showFileInputFileSelection.bind(this),
      serverConnection: this.showFileInputServerConnection.bind(this),
    };

    Object.keys(states).forEach((key) => {
      states[key](key === state);
    });
  }

  ///////////////////////////
  // ErrorPopup

  createErrorPopup(errorTitle, errorDescription, callback, callbackText) {
    const errorPopup = document.createElement('div');
    errorPopup.id = Math.random().toString(36).substring(7);
    errorPopup.classList.add('blocks', 'popup', 'red');
    const content = document.createElement('div');
    const errorPopupContent = document.createElement('div');
    const errorPopupEffect = document.createElement('div');
    const errorPopupTitle = document.createElement('h1');
    const errorPopupText = document.createElement('h2');
    const errorPopupButton = document.createElement('button');
    content.classList.add('content');
    errorPopupContent.classList.add('errorPopup-content');
    errorPopupEffect.classList.add('errorPopup-effect');
    errorPopupButton.classList.add('red', 'errorPopup-content-button');
    errorPopupText.classList.add('errorPopup-content-text');
    errorPopupTitle.classList.add('errorPopup-content-title');
    errorPopupText.innerText = errorDescription ?? errorTitle;
    errorPopupTitle.innerText = errorDescription ? errorTitle : 'Error';
    errorPopupButton.innerText = callbackText || 'OK';
    errorPopupEffect.appendChild(errorPopupTitle);
    errorPopupContent.appendChild(errorPopupEffect);
    errorPopupContent.appendChild(errorPopupText);
    errorPopupContent.appendChild(errorPopupButton);
    content.appendChild(errorPopupContent);
    errorPopup.appendChild(content);
    document.getElementById('appBlocks').appendChild(errorPopup);
    this.openedPopups.push(errorPopup.id);
    this.validateAnimation();
    errorPopupButton.addEventListener('click', () => {
      callback ? callback() : null;
      this.closePopup(errorPopup.id, () => {
        document.getElementById('appBlocks').removeChild(errorPopup);
        errorPopup.remove();
      });
    });
  }
}