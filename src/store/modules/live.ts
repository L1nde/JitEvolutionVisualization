import API from "@/api";
import { AppDetailDto } from "@/models";
import { Module } from "vuex";
import RootState from "../rootstate";

class State {
  projectId: string | null = null;
  fileUri: string | null = null;
  app: null | AppDetailDto = null;
}

export default {
  namespaced: true,
  state: new State(),
  getters: {},
  mutations: {
    reset(state: State) {
      Object.assign(state, new State());
    },
    focus(state: State, fileUri: string) {
      state.fileUri = fileUri;
    },
    changeProject(
      state: State,
      body: { projectId: string; }
    ) {
      state.projectId = body.projectId;
    },
    saveApp(
      state: State,
      body: { app: AppDetailDto }
    ) {
      state.app = body.app;
    },
  },
  actions: {
    async focus(
      { commit, state },
      body: { projectId: string; fileUri: string }
    ) {
      if (body.projectId === state.projectId) {
        commit("focus", body.fileUri);
      }
    },
    async changeProject({ commit, dispatch }, body: { projectId: string }) {
      commit("changeProject", {
        projectId: body.projectId
      });
      await dispatch("loadProject");
      commit("focus", null);
    },
    async loadProject({ commit, dispatch, state }) {
      commit("saveApp", {
        app: await API.app.get(state.projectId!),
      });
      commit("focus", null);
    }
  },
} as Module<State, RootState>;
