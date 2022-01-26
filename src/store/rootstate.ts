import { Module } from "vuex";

export default class RootState {
  readyResolver = null as
    | ((value: boolean | PromiseLike<boolean>) => void)
    | null;
  ready = new Promise<boolean>((resolve) => {
    this.readyResolver = resolve;
  });

  [key: string]: Module<any, any> | any;
}
