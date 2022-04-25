import { RouteConfig } from "vue-router";

export const baseRoute = process.env.VUE_APP_JIT_EVOLUTION_API_URI;

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: 'login' */ "@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: 'register' */ "@/views/Register.vue"),
  },
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: 'container' */ "@/views/Container.vue"),
    children: [
      {
        path: "/live",
        name: "live",
        component: () =>
          import(/* webpackChunkName: 'live' */ "@/views/Live.vue"),
      },
      // Default
      {
        path: "*",
        name: "live",
        component: () =>
          import(/* webpackChunkName: 'live' */ "@/views/Live.vue"),
      },
    ],
  },
  {
    path: "*",
    redirect: "/",
  },
] as RouteConfig[];
