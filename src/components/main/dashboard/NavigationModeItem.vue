<template>
  <input
    @click="setNavigationMode(navigationMode.name)"
    class="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded appearance-none cursor-pointer form-check-input checked:bg-blue-primary checked:border-blue-primaryfocus:outline-none"
    type="radio"
    name="navigation-mode"
    :id="navigationMode.id"
    :checked="checkNavigationMode(navigationMode.name)"
  />

  <label
    class="inline-block text-xs tracking-wider text-gray-800 cursor-pointer form-check-label"
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
