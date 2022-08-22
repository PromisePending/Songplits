class ServerConnection extends EventTarget {
  constructor(url) {
    super();
    this.url = url;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 15;
    this.reconnectTimeout = null;
  }

  reconnect() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.start();
    }
  }

  start() {
    this.server = new WebSocket(this.url);
    this.server.onopen = () => {
      this.dispatchEvent(new CustomEvent('serverConnectionOpen'));
      this.reconnectAttempts = 0;
    }
    this.server.onmessage = (event) => {
      this.dispatchEvent(new CustomEvent('serverConnectionMessage', { detail: event.data }));
    }
    this.server.onclose = () => {
      this.dispatchEvent(new CustomEvent('serverConnectionClose'));
      this.reconnectTimeout = setTimeout(() => {
        this.reconnect();
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
    this.server.onerror = (event) => {
      this.dispatchEvent(new CustomEvent('serverConnectionError', { detail: event.data }));
    }
  }

  send(message) {
    this.server.send(message);
  }

  stop() {
    this.reconnectAttempts = 0;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.server.close();
  }
}