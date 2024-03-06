<template>
  <router-link :to="item.route" class="block p-3">
    <img
      class="inline"
      :class="sidebarItemClass"
      :src="item.svg"
      :alt="item.name"
    />
    <span class="" v-if="!sidebarCollapsed"> {{ item.name }} </span>
  </router-link>
</template>
<script>
export default {
  props: ["item"],

  computed: {
    sidebarItemClass() {
      return {
        "mr-2": !this.sidebarCollapsed,
      };
    },

    sidebarCollapsed() {
      return this.$store.state.sidebarCollapsed;
    },
  },
};
</script>
