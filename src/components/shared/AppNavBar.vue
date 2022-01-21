<template>
  <div>
    <b-navbar sticky toggleable="md" variant="primary">
      <b-form-select v-model="$store.state.live.projectId" :options="$store.state.navbar.projectsOptions" @change="changeProject"></b-form-select>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            no-caret
            toggle-class="l-dropdown"
            menu-class="l-dropdown__menu"
            right
          >
            <template #button-content>
              User
            </template>
            <b-dropdown-item
              active-class="l-dropdown__menu-item"
              @click="logOut"
              >Logi välja</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import API from "@/api";
import { ProjectDto } from "@/models";
import { routeMap } from "@/router";
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "NavBar",

  data: () => ({
  }),

  methods: {
    async logOut() {
      await this.$store.dispatch("user/logout");
      this.$router.push(routeMap.login.location);
    },
    async changeProject(value: string){
      await this.$store.dispatch("live/changeProject", { projectId: value });
    }
  }
})
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
