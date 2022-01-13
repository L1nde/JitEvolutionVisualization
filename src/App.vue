<template>
  <div id="app" class="d-flex flex-column h-100">
    <router-view class="h-100" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

export default Vue.extend({
  name: "App",

  components: {

  }
});
</script>
<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
