import { StoreOptions } from "vuex";
import modules from "./modules";
import RootState from "./rootstate";

export default {
  state: new RootState(),
  mutations: {
    ready(state: RootState) {
      if (state.readyResolver) {
        state.readyResolver(true);
      }
    },
  },
  modules,
  actions: {
    async init({ commit, dispatch }) {
      await dispatch("user/init");
      await dispatch("navbar/init");
      commit("ready");
    },
  },
} as StoreOptions<RootState>;
