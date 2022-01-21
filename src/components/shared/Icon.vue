<template>
  <span
    v-if="name"
    class="icon"
    v-bind:class="{ 'icon--clickable': isClickable && !disabled, 'is-disabled': disabled }"
    v-on="$listeners"
  >
    <b-icon :icon="name"></b-icon>
  </span>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    name: {
      type: String,
      required: true,
    },
    clickable: [Boolean, String],
    disabled: {
      type: Boolean,
      default: false,
    }
  },
})
export default class Icon extends Vue {
  name?: string;
  clickable!: boolean;

  get isClickable() {
    return this.clickable || !!this.$listeners.click;
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.icon {
  color: var(--style-icon-color, inherit);

  &--clickable {
    cursor: pointer;
    color: inherit;
  }

  &.is-danger {
    color: $red;
  }

  &.is-primary {
    color: $primary;
  }
}
</style>
