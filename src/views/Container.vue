<template>
  <div>
    <div class="l-page">
      <div class="l-content">
        <app-nav-bar />
        <div class="l-content__view">
          <router-view />
        </div>
        <app-footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppFooter, AppNavBar } from "@/components/shared/";

@Component({
  components: {
    AppFooter,
    AppNavBar
  }
})
export default class Container extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.l-content {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__view {
    flex: 1;
  }
}

.l-page {
  display: flex;
  background-color: $bg;
  min-height: 100%;
}
</style>
