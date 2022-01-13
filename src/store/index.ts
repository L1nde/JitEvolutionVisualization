import Vue from "vue";
import Vuex from "vuex";
import router, { routeMap } from "@/router";
import root from "./root";
import API from "@/api";

Vue.use(Vuex);

const store = new Vuex.Store(root);

const unauthenticatedRoutes: string[] = [routeMap.login.name];

// move into utils
function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || typeof value === "undefined";
}

router.beforeEach((to, from, next) => {
  store.state.ready.then(() => {
    if (
      isNullOrUndefined(to.name) ||
      (!unauthenticatedRoutes.includes(to.name) && !store.state.user.token)
    ) {
      next(routeMap.login.location);
    } else if (to.name === routeMap.login.name && !!store.state.user.token) {
      next(routeMap.live.location);
    } else {
      next();
    }
  });
});

store.dispatch("init");

API.configureInterceptors(store);

export default store;
