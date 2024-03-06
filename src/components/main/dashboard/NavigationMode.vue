<template>
  <div class="card">
    <div class="">
      <small class="text-gray-700 font-bold tracking-wider">Mode</small>
    </div>
    <div class="" v-for="navigationMode in navigationModes">
      <NavigationModeItem :navigationMode="navigationMode" />
    </div>
  </div>
</template>

<script>
import NavigationModeItem from "./NavigationModeItem.vue";

export default {
  components: {
    NavigationModeItem,
  },
  data() {
    return {
      navigationModes: [
        {
          id: "mode-navgoal",
          name: "Navigation Goal",
        },
        {
          id: "mode-joystick",
          name: "Joystick",
        },
      ],
    };
  },
};
</script>
