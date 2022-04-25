import Vue from "vue";
import { Module } from "vuex";

import API from "@/api";
import router, { routeMap } from "@/router";
import RootState from "@/store/rootstate";
import { notify } from "@/components/notifications";

const WEB_SOCKET_RECONNECT_TIMEOUT = 5000;
const WEB_SOCKET_RECONNECT_MAX_ATTEMPTS = 12;

enum Messages {
  UNAUTHENTICATED = "Unauthenticated",
  FILE_OPENED = "FileOpened",
  PROJECT_ADDED = "ProjectAdded",
  PROJECT_UPDATING = "ProjectUpdating",
  PROJECT_UPDATED = "ProjectUpdated",
}

class State {
  isPlannedClose = false;
  webSocketReconnectTimer: NodeJS.Timeout | null = null;
  webSocketReconnectAttempts = 0;
}

export default {
  namespaced: true,
  state: new State(),
  mutations: {
    planClose(state: State) {
      state.isPlannedClose = true;
    },
    reset(state: State) {
      Object.assign(state, new State());
    },
    setWebSocketReconnectTimer(state: State, timer: NodeJS.Timeout) {
      state.webSocketReconnectTimer = timer;
    },
    setWebSocketReconnectAttempts(state: State, attempts: number) {
      state.webSocketReconnectAttempts = attempts;
    },
  },
  actions: {
    reconnectSocket({ commit, dispatch, rootState, state }) {
      if (state.webSocketReconnectTimer !== null && API.websocket.isConnected) {
        console.info("WebSocket connection recovered!");
        clearTimeout(state.webSocketReconnectTimer);
        commit("setWebSocketReconnectTimer", null);
        commit("setWebSocketReconnectAttempts", 0);
        return;
      }
      if (
        state.webSocketReconnectAttempts >= WEB_SOCKET_RECONNECT_MAX_ATTEMPTS
      ) {
        if (state.webSocketReconnectTimer !== null)
          clearTimeout(state.webSocketReconnectTimer);
        commit("setWebSocketReconnectTimer", null);
        commit("setWebSocketReconnectAttempts", 0);
        dispatch("onSocketFail");
        return;
      }
      const token = rootState.user.token;
      const timer = setTimeout(() => {
        dispatch("reconnectSocket");
      }, WEB_SOCKET_RECONNECT_TIMEOUT);
      commit("setWebSocketReconnectTimer", timer);
      commit(
        "setWebSocketReconnectAttempts",
        state.webSocketReconnectAttempts + 1
      );
      console.warn("WebSocket reconnecting...");
      dispatch("connectSocket", token);
    },
    async connectSocket({ commit, dispatch, state, rootState }, token: string) {
      const socketUri = process.env.VUE_APP_JIT_EVOLUTION_WEBSOCKET_URI;

      const connection = await API.websocket.connect(token, socketUri);

      connection.on(Messages.UNAUTHENTICATED, () => {
        // If the socket says we're unautheticated, notify and log out
        dispatch("onSocketFail");
      });

      connection.on(Messages.FILE_OPENED, (projectId, fileUri) => {
        dispatch("live/focus", { projectId, fileUri }, { root: true });
      });

      connection.on(Messages.PROJECT_ADDED, () => {
        dispatch("navbar/init", null, { root: true });
      });

      connection.on(Messages.PROJECT_UPDATING, (projectId) => {
        notify.success(`${projectId} analysis started!`, undefined, { duration: 1000 });
        dispatch("live/loadQueueItems", null, { root: true });
      });

      connection.on(Messages.PROJECT_UPDATED, (projectId) => {
        notify.success(`${projectId} analysis finished!`, undefined, { duration: 1000 });
        if (rootState.live.project.id === projectId){
          dispatch("navbar/loadProjectVersionsOptions", rootState.live.project.id, { root: true });
          dispatch("live/changeProjectVersion", { versionNumber: null }, { root: true });
          dispatch("live/loadProject", null, { root: true });
        }
        dispatch("live/loadQueueItems", null, { root: true });
      });

      connection.onclose((error) => {
        if (state.isPlannedClose) {
          // On connection close, clear all state
          commit("reset");
        } else {
          console.error("WebSocket connection lost!");
          // If the socket times out or crashes, notify about error and reset state.
          if (error) {
            dispatch("onSocketFail");
          }
        }
      });

      await connection.start();
    },

    async disconnectSocket({ commit }) {
      commit("planClose");
      await API.websocket.disconnect();
    },
    // If the socket reaches a state where it can't recover, log out and notify
    async onSocketFail({ dispatch, commit }) {
      commit("reset");
      dispatch("user/logout", {}, { root: true });
      router.push(routeMap.login.location);

      if (API.websocket.hasConnection) {
        // This message is a lie, there may be dozens of reasons why it failed
        console.error("Webserver connection lost!");
      }
      // Continue regardless of how this goes
      try {
        await API.websocket.disconnect();
      } catch (error) {
        console.error(error);
      }
    },
  },
} as Module<State, RootState>;
