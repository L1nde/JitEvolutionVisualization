<template>
  <div>
    <b-navbar sticky toggleable="md" variant="primary">
      <b-form-select
        v-model="project.id"
        :options="$store.state.navbar.projectsOptions"
        @change="changeProject"
      ></b-form-select>
      <b-form-select
        v-model="project.versionNumber"
        :options="projectVersions"
        @change="changeProjectVersion"
      ></b-form-select>
      <b-button v-if="!isPlaying" :disabled="!playEnabled" @click="play"
        >Play</b-button
      >
      <b-button v-else @click="stop">Stop</b-button>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            no-caret
            toggle-class="l-dropdown"
            menu-class="l-dropdown__menu"
            right
          >
            <template #button-content> User </template>
            <b-dropdown-item @click="copyAccessKeyToClipboard"
              >Access key</b-dropdown-item
            >
            <b-dropdown-item
              active-class="l-dropdown__menu-item"
              @click="logOut"
              >Log out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { routeMap } from "@/router";
import { timeout } from "d3-timer";
import { Vue } from "vue-property-decorator";
import { notify } from "@/components/notifications";

export default Vue.extend({
  name: "NavBar",

  data: () => ({
    isPlaying: false,
  }),
  computed: {
    project(): { id: string; versionNumber: number } {
      return this.$store.state.live.project;
    },
    projectVersions(): { value: string; text: string }[] {
      return this.$store.state.navbar.projectVersionsOptions;
    },
    playEnabled(): boolean {
      return !!this.project.id && this.projectVersions.length != 0;
    },
    accessKey() {
      return this.$store.state.user.user.accessKey;
    }
  },

  methods: {
    copyAccessKeyToClipboard() {
      try {
        navigator.clipboard.writeText(this.accessKey);
        notify.success(`Access key copied`, undefined, { duration: 1000 });
      }
      catch{
        notify.error(`Failed to copy access key`, undefined, { duration: 1000 });
      }
    },
    async logOut() {
      await this.$store.dispatch("user/logout");
      this.$router.push(routeMap.login.location);
    },
    async changeProject() {
      await this.$store.dispatch("live/changeProject", {
        projectId: this.project.id,
        versionNumber: this.project.versionNumber,
      });
    },
    async changeProjectVersion() {
      await this.$store.dispatch("live/changeProjectVersion", {
        versionNumber: this.project.versionNumber,
      });
    },
    async play() {
      this.isPlaying = true;

      if (this.playEnabled) {
        timeout(async () => {
          for (const version of this.projectVersions.reverse()) {
            await this.$store.dispatch("live/changeProjectVersion", {
              versionNumber: version.value,
              disableLoadingLayer: true,
            });

            if (!this.isPlaying) break;
          }
        });
      }
    },
    async stop() {
      this.isPlaying = false;
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/_variables.scss";

.l-dropdown {
  border-radius: 100px;
  border: 1px solid transparent;
  padding: 0px;

  &:hover {
    border: 1px solid $secondary;
    background-color: #eeeeee;
  }

  &__menu {
    border-radius: 10px !important;
    padding: 0px !important;

    &item {
      background-color: white !important;
      border: 1px solid $secondary;
    }
    :hover {
      border-radius: 5px;
      background-color: white !important;
      border: 1px solid $secondary;
    }

    :active {
      border-radius: 5px;
      border: 1px solid $secondary;
      color: $secondary !important;
    }
  }
}
</style>
