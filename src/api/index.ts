import { baseRoute } from "@/router/routes";
import axios, { AxiosInstance } from "axios";
import { Store } from "vuex";
import UserApi from "./modules/identities/user";
import AppApi from "./modules/analyzer/app";
import WebsocketApi from "./modules/websocket";
import QueueItemApi from "./modules/queue/queueItem";

const API = new (class API {
  private instance: AxiosInstance;

  public websocket: WebsocketApi;
  public user: UserApi;
  public app: AppApi;
  public queueItem: QueueItemApi;
  
  constructor() {
    this.instance = axios.create({
      baseURL: baseRoute,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.websocket = new WebsocketApi(
      process.env.VUE_APP_JIT_EVOLUTION_WEBSOCKET_URI ?? ""
    );
    this.user = new UserApi(this.instance);
    this.app = new AppApi(this.instance);
    this.queueItem = new QueueItemApi(this.instance);
  }

  public configureInterceptors(store: Store<any>) {
    this.instance.interceptors.request.use((request) => {
      if (store.state.user.token && request.headers) {
        const token = store.state.user.token as string;
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    });
  }
})();

export default API;
