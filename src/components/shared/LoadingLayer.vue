<template>
  <div v-if="isLoading" class="text-center overlay">
    <div>
      <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
      <p id="cancel-label">Please wait...</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "loading-layer",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: #5b5b5b9c;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>