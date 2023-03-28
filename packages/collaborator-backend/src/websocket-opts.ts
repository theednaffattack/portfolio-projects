export const wsOpts = {
  // Set this to `false` if you want to connect manually using wsProvider.connect()
  connect: true,
  // Specify a query-string that will be url-encoded and attached to the `serverUrl`
  // I.e. params = { auth: "bearer" } will be transformed to "?auth=bearer"
  params: {}, // Object<string,string>
  // You may polyill the Websocket object (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
  // E.g. In nodejs, you could specify WebsocketPolyfill = require('ws')
  WebsocketPolyfill: WebSocket,
  // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
  // awareness: new awarenessProtocol.Awareness(new Y.Doc()),
  // Specify the maximum amount to wait between reconnects (we use exponential backoff).
  maxBackoffTime: 2500,
};
