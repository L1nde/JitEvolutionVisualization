import API from "@/api";
import { AppDetailDto, Coordinate, QueueItemDto } from "@/models";
import { OverlayComponent } from "@/models/overlay-component";
import { xml } from "d3";
import { stat } from "fs";
import { Module } from "vuex";
import RootState from "../rootstate";

class State {
  project: { id: string | null, versionNumber: number | null } = { id: null, versionNumber: null };
  fileUri: string | null = null;
  app: null | AppDetailDto = null;
  coordinates: { [id: number]: { start: Coordinate, end: Coordinate } } = {};
  relationships: { id: string, startId: number, endId: number, isHighlighted: boolean, highlightInitiator?: string }[] = [];
  overlayComponents: OverlayComponent[] = [];
  isLoading = false;
  queueItems: null | QueueItemDto[] = [];
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
      state.fileUri = fileUri.replaceAll("\\", "/");
    },
    changeProject(
      state: State,
      body: { projectId: string; versionNumber: number | null }
    ) {
      state.project = { id: body.projectId, versionNumber: body.versionNumber };
      state.coordinates = {};
      state.relationships = []
      state.overlayComponents = [];
    },
    saveApp(
      state: State,
      body: { app: AppDetailDto }
    ) {
      state.app = body.app;
    },
    saveQueueItems(
      state: State,
      body: QueueItemDto[]
    ) {
      state.queueItems = body;
    },
    saveCoordinates(
      state: State,
      body: { id: number, coords: { start: Coordinate, end: Coordinate } }) {
      state.coordinates[body.id] = body.coords;
    },
    saveRelationship(
      state: State,
      body: { id: string, startId: number, endId: number }) {
      state.relationships.push({ ...body, isHighlighted: false });
    },
    setRelationshipHighlight(
      state: State,
      body: { id: number, isHighlighted: boolean, highlightInitiator: string }) {
      state.relationships = state.relationships.map(x => {
        if (!x.isHighlighted && (x.startId === body.id || x.endId === body.id)) {
          return { ...x, isHighlighted: body.isHighlighted, highlightInitiator: body.highlightInitiator };
        } else if (x.isHighlighted && x.highlightInitiator === body.highlightInitiator && (x.startId === body.id || x.endId === body.id)) {
          return { ...x, isHighlighted: body.isHighlighted, highlightInitiator: body.isHighlighted ? body.highlightInitiator : undefined };
        }
        return x;
      });
    },
    addOverlayComponent(
      state: State,
      body: OverlayComponent) {
      state.overlayComponents = state.overlayComponents.filter(x => !((!body.initiator || body.initiator === x.initiator) && x.id === body.id));
      state.overlayComponents.push(body);
    },
    removeOverlayComponent(state: State, body: { id: string, initiator?: string }) {
      state.overlayComponents = state.overlayComponents.filter(x => !((!body.initiator || body.initiator === x.initiator) && x.id === body.id));
    },
    setIsLoading(state: State, isLoading: boolean) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async init({ dispatch }) {
      await dispatch("loadQueueItems");
    },
    async loadQueueItems({ commit, rootState }) {
      if (rootState.user.user?.id) {
        const queueItems = await API.queueItem.getAll();
        commit("saveQueueItems", queueItems);
      }
    },
    async focus(
      { commit, state },
      body: { projectId: string; fileUri: string }
    ) {
      if (body.projectId === state.project.id) {
        commit("focus", body.fileUri);
      }
    },
    async changeProject({ commit, dispatch }, body: { projectId: string }) {
      commit("changeProject", {
        projectId: body.projectId,
        versionNumber: null
      });
      await dispatch("loadProject");
      commit("focus", null);

      await dispatch("navbar/loadProjectVersionsOptions", body.projectId, { root: true });
    },
    async changeProjectVersion({ commit, dispatch, state }, body: { versionNumber: number | null, disableLoadingLayer?: boolean }) {
      commit("changeProject", {
        projectId: state.project.id,
        versionNumber: body.versionNumber
      });
      await dispatch("loadProject", body.disableLoadingLayer);
      commit("focus", null);
    },
    async loadProject({ commit, dispatch, state }, disableLoadingLayer?: boolean) {
      try {
        if (!disableLoadingLayer)
          commit("setIsLoading", true);
        commit("saveApp", {
          app: await API.app.get(state.project.id!, state.project.versionNumber),
        });
        commit("focus", null);
      }
      finally {
        if (!disableLoadingLayer)
          commit("setIsLoading", false);
      }
    },

    async saveCoordinates({ commit }, body: { id: number, coords: { start: Coordinate, end: Coordinate } }) {
      commit("saveCoordinates", body);
    },
    async setRelationshipHighlight({ commit }, body: { id: number, isHighlighted: boolean, highlightInitiator: string }) {
      commit("setRelationshipHighlight", body);
    },
    async createRelationship({ commit }, body: { id: string, startId: number, endId: number }) {
      commit("saveRelationship", body);
    },
    async addOverlayComponent({ commit }, body: { overlayComponent: OverlayComponent }) {
      commit("addOverlayComponent", body);
    },
    async removeOverlayComponent({ commit }, body: { id: string }) {
      commit("removeOverlayComponent", body);
    },
    async addRelationshipToOverlayComponent({ commit, state }, overlayComponent: OverlayComponent) {
      const relationships = state.relationships.filter(x => x.startId.toString() == overlayComponent.id || x.endId.toString() == overlayComponent.id);

      for (const r of relationships) {
        commit("addOverlayComponent", { id: r.id, position: overlayComponent.position, initiator: overlayComponent.initiator });
      }
    },
    async removeRelationshipFromOverlayComponent({ commit, state }, body: { id: string, initiator: string }) {
      const relationships = state.relationships.filter(x => x.startId.toString() == body.id || x.endId.toString() == body.id);

      for (const r of relationships) {
        commit("removeOverlayComponent", { id: r.id, initiator: body.initiator });
      }
    },
  },
} as Module<State, RootState>;
