import Vue from 'vue';
import { Module } from 'vuex';

import API from '@/api';
import router, { routeMap } from '@/router';
import RootState from '@/store/rootState';

const WEB_SOCKET_RECONNECT_TIMEOUT = 5000;
const WEB_SOCKET_RECONNECT_MAX_ATTEMPTS = 12;

enum Messages {
  UNAUTHENTICATED = 'Unauthenticated',
}

class State {
  isPlannedClose = false;
  webSocketReconnectTimer: NodeJS.Timeout | null = null;
  webSocketReconnectAttempts = 0;
  shipmentIdsToReload: string[] = []
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
        console.info('WebSocket connection recovered!');
        clearTimeout(state.webSocketReconnectTimer);
        commit('setWebSocketReconnectTimer', null);
        commit('setWebSocketReconnectAttempts', 0);
        return;
      }
      if (state.webSocketReconnectAttempts >= WEB_SOCKET_RECONNECT_MAX_ATTEMPTS) {
        if (state.webSocketReconnectTimer !== null) clearTimeout(state.webSocketReconnectTimer);
        commit('setWebSocketReconnectTimer', null);
        commit('setWebSocketReconnectAttempts', 0);
        dispatch('onSocketFail');
        return;
      }
      const token = rootState.user.token;
      const timer = setTimeout(() => {
        dispatch('reconnectSocket');
      }, WEB_SOCKET_RECONNECT_TIMEOUT);
      commit('setWebSocketReconnectTimer', timer);
      commit('setWebSocketReconnectAttempts', state.webSocketReconnectAttempts + 1);
      console.warn('WebSocket reconnecting...');
      dispatch('connectSocket', token);
    },
    async connectSocket({ commit, dispatch, state, rootState }, token: string) {
      const socketUri = process.env.VUE_APP_JIT_EVOLUTION_WEBSOCKET_URI;

      const connection = await API.websocket.connect(token, socketUri);
        
      connection.on(Messages.UNAUTHENTICATED, () => {
        // If the socket says we're unautheticated, notify and log out
        dispatch('onSocketFail');
      });

      connection.onclose((error) => {
        if (state.isPlannedClose) {
          // On connection close, clear all state
          commit('reset');
        } else {
          console.error('WebSocket connection lost!');
          // If the socket times out or crashes, notify about error and reset state.
          if (error) {
            dispatch('onSocketFail');
          }
        }
      });

      await connection.start();
    },

    async disconnectSocket({ commit }) {
      commit('planClose');
      await API.websocket.disconnect();
    },
    // If the socket reaches a state where it can't recover, log out and notify
    async onSocketFail({ dispatch, commit }) {
      commit('reset');
      dispatch('user/logout', {}, { root: true });
      router.push(routeMap.login.location);

      if (API.websocket.hasConnection) {
        // This message is a lie, there may be dozens of reasons why it failed
        console.error('Webserver connection lost!');
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
