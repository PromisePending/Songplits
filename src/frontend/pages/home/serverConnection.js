class ServerConnection extends EventTarget {
    constructor(url) {
        super();
        this.server = new WebSocket(url);
        this.server.onopen = () => {
            this.dispatchEvent(new CustomEvent('serverConnectionOpen'));
        }
        this.server.onmessage = (event) => {
            this.dispatchEvent(new CustomEvent('serverConnectionMessage', { detail: event.data }));
        }
        this.server.onclose = () => {
            this.dispatchEvent(new CustomEvent('serverConnectionClose'));
        }
        this.server.onerror = (event) => {
            this.dispatchEvent(new CustomEvent('serverConnectionError', { detail: event.data }));
        }
    }
    send(message) {
        this.server.send(message);
    }
}