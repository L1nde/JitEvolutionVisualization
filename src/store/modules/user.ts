import API from "@/api";
import { Jwt, PasswordLoginDto, UserDto, UserTokenDto } from "@/models";
import jwtDecode from "jwt-decode";
import localforage from "localforage";
import moment from "moment";
import { Module } from "vuex";
import RootState from "../rootstate";

class State {
  user?: UserDto | null = null;
  token?: string | null = null;
}

export default {
  namespaced: true,
  state: new State(),
  getters: {
  },
  mutations: {
    login(state: State, user: UserTokenDto) {
      state.user = user.user;
      state.token = user.token;
    },
    logout(state: State) {
      state.user = null;
      state.token = null;
    },
    reset(state: State) {
      Object.assign(state, new State());
    }
  },
  actions: {
    async init({ commit, dispatch }) {
      const localUser = await localforage.getItem("user");
      if (localUser) {
        const { user, token } = localUser as UserTokenDto;
        try {
          const decoded = jwtDecode<Jwt>(token!);
          const expires = moment.unix(decoded.exp).utc();
          const isExpired = expires.isBefore(moment.utc());
          if (isExpired) {
            return dispatch("logout");
          }
          await dispatch('websocket/connectSocket', token, { root: true });
          commit("login", { user, token });
        } catch {
          return dispatch("logout");
        }
      }
    },
    async login({ commit, dispatch }, body: PasswordLoginDto) {
      const { user, token } = await API.user.login(body);
      await localforage.setItem("user", { user, token });
      await dispatch('websocket/connectSocket', token, { root: true });
      commit("login", { user, token });
    },
    async logout({ commit, dispatch }) {
      await localforage.clear();
      await dispatch('websocket/disconnectSocket', {}, { root: true });
      commit("logout");
    }
  }
} as Module<State, RootState>;
