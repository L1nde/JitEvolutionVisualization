import { Vue } from "vue-property-decorator";
import VueRouter, { RouteConfig } from "vue-router";
import { routes } from "./routes";

Vue.use(VueRouter);

interface RouteMap {
  [key: string]: ReturnType<VueRouter["resolve"]> & { name: string };
}

const router = new VueRouter({
  routes: routes,
  mode: "history",
  base: process.env.BASE_URL
});

function mapRoutes(routeMap: RouteMap, routes: RouteConfig[]) {
  return (routes || []).reduce((map, route) => {
    const name = route.name;
    const path = route.path;
    if (name) {
      map[name] = Object.assign(
        {
          name
        },
        router.resolve({ name, path })
      );
    }
    if (route.children) {
      mapRoutes(map, route.children);
    }
    return map;
  }, routeMap);
}

export const routeMap = mapRoutes({}, routes);

export default router;
