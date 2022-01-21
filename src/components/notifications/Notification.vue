<template>
  <div
    class="notification-component"
    v-if="item"
  >
    <!-- We reuse the default notification classes -->
    <div
      class="vue-notification-template vue-notification"
      v-bind:class="item.type"
      v-on:click="tryClose()"
    >
      <icon
        name="x"
        v-on:click="tryClose(true)"
      />
      <div class="notification-title">{{item.title}}</div>
      <div
        class="notification-content"
        v-if="item.text"
      >{{item.text}}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Icon from '@/components/shared/Icon.vue';

@Component({
  props: {
    // Both of these are passed by the library
    item: {
      type: Object,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: {
    Icon,
  },
})
export default class Notification extends Vue {
  get isError() {
    return this.$props.item.type === 'error';
  }

  tryClose(forceClose = false) {
    // Only close non-errors on click
    if (!forceClose && this.isError) return;
    this.$props.close();
  }
}
</script>
<style lang="scss" scoped>
//@import '@/styles/variables.scss';

.notification-component {
  padding: 0 0 5px;

  .vue-notification {
    position: relative;
    margin: 0;

    .icon {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      padding: 20px;
      margin: -10px;
      opacity: 0.75;

      &:hover {
        opacity: 1;
      }
    }
  }
}
.notification-title {
  white-space: pre-line;
}
</style>
