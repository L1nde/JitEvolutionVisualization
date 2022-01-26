import Vue from "vue";
import { NotificationOptions } from "vue-notification";

export interface ExtendedNotificationOptions extends NotificationOptions {
  type?: "success" | "info" | "warn" | "error";
}

export default new (class Notify {
  success(title: string, text = "", options?: ExtendedNotificationOptions) {
    this.showWithMergedOptions(
      {
        title,
        text,
        type: "success",
      },
      options
    );
  }

  warn(title: string, text = "", options?: ExtendedNotificationOptions) {
    this.showWithMergedOptions(
      {
        title,
        text,
        type: "warn",
      },
      options
    );
  }

  error(title: string, text = "", options?: ExtendedNotificationOptions) {
    this.showWithMergedOptions(
      {
        title,
        text,
        type: "error",
        duration: -1,
      },
      options
    );
  }

  show(options: ExtendedNotificationOptions) {
    if (process.env.NODE_ENV === "test") {
      console.info(`Notify:\n${options.title}\n${options.text}`);
    } else {
      Vue.notify(options);
    }
  }

  clearAll() {
    if (process.env.NODE_ENV === "test") {
      console.info("Notify: clear");
    } else {
      Vue.notify({
        clean: true,
      });
    }
  }

  private showWithMergedOptions(
    options: ExtendedNotificationOptions,
    extraOptions?: ExtendedNotificationOptions
  ) {
    const defaultOptions = {
      duration: 5000,
    };
    this.show(Object.assign(defaultOptions, extraOptions, options));
  }
})();
