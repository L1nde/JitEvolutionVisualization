<template>
  <div id="app" class="d-flex flex-column h-100">
    <router-view class="h-100" />
    <notifications
      position="top center"
      v-bind:max="5"
      v-bind:close-on-click="false"
    >
      <template slot="body" slot-scope="props">
        <notification v-bind="props" />
      </template>
    </notifications>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Notification } from "@/components/notifications";

export default Vue.extend({
  name: "App",

  components: {
    Notification,
  },
});
</script>
<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
