<template>
  <div class="fluid-container l-footer">
    <p class="text-center">
      Copyright &copy; 2021, Linde.ee. All Rights Reserved.
    </p>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class AppFooter extends Vue {}
</script>

<style lang="scss">
@import "@/assets/scss/_variables.scss";
.l-footer {
  background-color: $primary;

  p {
    margin: 0px;
  }
}
</style>
