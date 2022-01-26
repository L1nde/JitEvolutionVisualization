import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";

export default class WebsocketApi {
  private socketUri: string;
  private connection?: HubConnection;

  constructor(socketUri: string) {
    this.socketUri = socketUri;
  }

  get hasConnection() {
    return Boolean(this.connection);
  }

  get isConnected() {
    return this.connection?.state === HubConnectionState.Connected;
  }

  async connect(token: string, uri?: string) {
    if (this.connection) {
      await this.connection.stop();
    }
    console.log(this.socketUri);
    this.connection = new HubConnectionBuilder()
      .withUrl(uri || this.socketUri, {
        accessTokenFactory: () => token,
      })
      .build();
    return this.connection;
  }

  async invoke(command: string, ...args: any[]) {
    if (!this.connection) throw new TypeError("No websocket connection");
    // If the connection has dropped, try reconnecting before failing altogether
    if (this.connection.state === HubConnectionState.Disconnected) {
      // Intentionally has no try-catch, let it blow up
      await this.connection.stop();
      await this.connection.start();
    }
    // eslint-disable-next-line no-useless-call
    return this.connection.invoke.apply(this.connection, [command, ...args]);
  }

  async disconnect() {
    if (!this.connection) return Promise.resolve();
    try {
      await this.connection.stop();
      this.connection = undefined;
    } catch (_) {
      this.connection = undefined;
    }
  }
}
