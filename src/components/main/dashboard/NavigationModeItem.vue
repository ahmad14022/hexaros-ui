<template>
  <input
    @click="setNavigationMode(navigationMode.name)"
    class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-primary checked:border-blue-primaryfocus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
    type="radio"
    name="navigation-mode"
    :id="navigationMode.id"
    :checked="checkNavigationMode(navigationMode.name)"
  />

  <label
    class="form-check-label inline-block text-gray-800 text-xs tracking-wider cursor-pointer"
    :for="navigationMode.id"
  >
    {{ navigationMode.name }}
  </label>
</template>
<script>
export default {
  props: ["navigationMode"],

  methods: {
    setNavigationMode(mode) {
      this.$store.commit("setNavigationMode", mode);
      this.sendLog(`Navigation mode changed to ${mode}`, "info");
    },

    checkNavigationMode(mode) {
      return this.$store.state.navigationMode === mode;
    },

    sendLog(text, category) {
      const log = { text, category };
      emitter.emit("addLog", log);
    },
  },
};
</script>
