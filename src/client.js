const express = require('express');
const fs = require('fs');
const path = require('path');

/**
 * The main class that will serve the webapp online.
 */
class Client {
  constructor(port) {
    this.port = port || 3000;
    this.app = express();

    this.pageLookup = {
      'home': '/',
    }
  }

  /**
   * Loads the webapp.
   */
  load() {
    // reads the pages folder inside the frontend folder and maps each folder to a route using a lookup table.
    const pages = fs.readdirSync(path.join(__dirname, './frontend/pages'));
    pages.forEach(page => {
      const pageRoute = this.pageLookup[page] ?? `/${page}`;
      this.app.use(pageRoute, express.static(path.join(__dirname, `./frontend/pages/${page}`)));
    });

    // serves the static assets.
    this.app.use(express.static('./frontend/assets'));
  }

  /**
   * Initializes the webapp.
   * @returns {void}
   */
  init() {
    // Starts the webapp.
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = Client;