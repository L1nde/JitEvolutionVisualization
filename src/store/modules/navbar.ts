import API from "@/api";
import { Module } from "vuex";
import RootState from "../rootstate";

class State {
    projectsOptions: {value: string, text: string}[] = [];
}

export default {
  namespaced: true,
  state: new State(),
  getters: {
  },
  mutations: {
    reset(state: State) {
      Object.assign(state, new State());
    },
    projectsOptions(state: State, projectsOptions: {value: string, text: string}[]) {
      state.projectsOptions = projectsOptions;
    },
  },
  actions: {
    async init({ commit, rootState }) {
      if (rootState.user.user?.id) {
        const projects = await API.user.projects(rootState.user.user.id);
        commit("projectsOptions", projects.map(x => { return { value: x.projectId!, text: x.projectId!}; }))
      }
    },
  }
} as Module<State, RootState>;
