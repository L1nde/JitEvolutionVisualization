<template>
  <div class="login-page">
    <b-row>
      <b-col
        cols="12"
        sm="6"
        md="5"
        xl="4"
        align-self="center"
        class="login-container"
      >
        <b-card bg-variant="secondary" text-variant="white">
          <b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
          <b-overlay
            variant="dark"
            class="loading"
            :show="loading"
            rounded="sm"
          >
            <b-form class="login-container__form" @submit.prevent="submit">
              <b-form-group
                label-class="text-left"
                id="username-group"
                label="Username:"
                label-for="username"
              >
                <b-form-input
                  id="username"
                  v-model="loginInfo.username"
                  type="text"
                  placeholder="Kasutajanimi"
                  required
                />
              </b-form-group>
              <b-form-group
                label-class="text-left"
                id="password-group"
                label="Password:"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  v-model="loginInfo.password"
                  type="password"
                  placeholder="Parool"
                  required
                />
              </b-form-group>
              <b-button :disabled="loading" type="submit" variant="primary"
                >Logi sisse</b-button
              >
            </b-form>
            <template #overlay>
              <div class="text-center">
                <b-icon
                  icon="stopwatch"
                  font-scale="3"
                  animation="cylon"
                ></b-icon>
                <p id="cancel-label">Palun oota...</p>
              </div>
            </template>
          </b-overlay>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { PasswordLoginDto } from "@/models";
import { routeMap } from "@/router";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Login extends Vue {
  private loginInfo: PasswordLoginDto = {};
  private loading = false;
  private error: string | null = null;

  async submit() {
    this.loading = true;
    try {
      await this.$store.dispatch("user/login", this.loginInfo);
      this.error = null;
      this.$router.push(routeMap.live.location);
    } catch (error: any) {
      this.error = error?.response?.data?.Title;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  background-image: url("~@/assets/images/evolution.gif");
  background-size: contain;
  background-color: #1d3382;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  .row {
    margin: 0px;
  }
}
.login-container {
  display: flex;
  flex-direction: column;
  margin: auto;

  &__form {
    display: flex;
    flex-direction: column;
  }
}
.loading {
  padding: 10px;
}
</style>
