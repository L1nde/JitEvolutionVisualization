import Vue from "vue";
import App from "./App.vue";
import './plugins/bootstrap-vue';
import './plugins/panzoom-vue';
import './plugins/notification-vue';
import router from "./router";
import store from "./store";
import { notify } from "./components/notifications";

Vue.config.productionTip = false;
Vue.config.errorHandler = function errorHandler(error: Error, vm: Vue, info: any) {
  // Give the developer a lead where to look, if possible
  const componentName = (vm && vm.$options && vm.$options.name) || undefined;
  notify.error(error.message, componentName
    ? `Thrown in ${componentName}`
    : undefined
  );
  throw error;
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
