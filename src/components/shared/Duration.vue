<template>
  <span>
    {{ elapsed }}
  </span>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "duration",

  props: {
    date: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    nowUtc: Date.now(),
    interval: null as any,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    intervals: {
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
    },
  }),
  computed: {
    elapsed() {
      return (
        (this.days != 0
          ? `${this.days.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}:`
          : "") +
        (this.days != 0 || this.hours != 0
          ? `${this.hours.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}:`
          : "") +
        `${this.minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}:${this.seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`
      );
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.updateDiffs();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.interval as any);
  },
  methods: {
    ds(i: number) {
      return null;
    },
    updateDiffs() {
      //lets figure out our diffs
      let diff = Math.abs(Date.now() - Date.parse(this.date));
      this.days = Math.floor(diff / this.intervals.day);
      diff -= this.days * this.intervals.day;
      this.hours = Math.floor(diff / this.intervals.hour);
      diff -= this.hours * this.intervals.hour;
      this.minutes = Math.floor(diff / this.intervals.minute);
      diff -= this.minutes * this.intervals.minute;
      this.seconds = Math.floor(diff / this.intervals.second);
    },
  },
});
</script>

<style lang="scss">
</style>
