import { RouteConfig } from "vue-router";

export const baseRoute =
  process.env.NODE_ENV === "production"
    ? "https://dashboard-api.linde.ee/"
    : "https://localhost:7259/"; // maybe move into environment file

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: 'login' */ "@/views/Login.vue")
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
          import(
            /* webpackChunkName: 'live' */ "@/views/Live.vue"
          )
      },
      // Default
      {
        path: "*",
        name: "live",
        component: () =>
          import(/* webpackChunkName: 'live' */ "@/views/Live.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: "/"
  }
] as RouteConfig[];
