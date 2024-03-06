<template>
  <aside
    id="sidebar"
    class="bg-slate-700 max-w-1/5 h-full sm:hidden md:hidden lg:block fixed top-0 left-0 bottom-0"
  >
    <div class="bg-gray-secondary h-32 grid content-center">
      <img class="m-auto p-12" src="assets/icons/sidebar/header/Logo PNG.png" />
    </div>
    <ul class="mt-10 px-2">
          <li
            class="text-white-primary rounded-lg mt-1
                  hover:bg-blue-secondary"
            :class="setActiveMenuColor(item.name)"
            @click="setActiveMenu(item.name)"
            v-for="item in items"
          >
            <SidebarItem :item="item" />
          </li>
        </ul>
  </aside>
</template>

<script>
import SidebarItem from './main/sidebar/SidebarItem.vue';
import {store} from '../store'

  
  export default{


    components:{
      SidebarItem,
      store
      
    },

    
    data() {
        return {
            items: [
                {
                    name: " Dashboard ",
                    svg: "assets/icons/sidebar/grid-fill.svg",
                    route: "/",
                },
                {
                    name: " Mission ",
                    svg: "assets/icons/sidebar/target-fill.svg",
                    route: "/mission",
                },
                {
                    name: " Setting ",
                    svg: "assets/icons/sidebar/Setting-fill.svg",
                    route: "/setting",
                },
                {
                    name: " About ",
                    svg: "assets/icons/sidebar/info-circle-fill.svg",
                    route: "/about",
                },
            ],
        };
    },

    computed: {
    sidebarCollapsed() {
      return this.$store.state.sidebarCollapsed;
    },
  },

  methods: {
    setActiveMenu(route) {
      this.$store.commit('setActiveMenu', route);
    },

    setActiveMenuColor(route) {
      if (this.$store.state.activeMenu === route) {
        return 'bg-blue-tertiary pointer-events-none';
      }
    },

    getSidebarWidth() {
      return this.$store.state.sidebarWidth;
    },

    updateSidebarWidth() {
      if (this.$store.state.refreshed) {
        this.$store.commit('setRefreshed', false);
        this.$store.commit('setSidebarWidth', this.$store.state.sidebarWidth);
      } else {
        this.$store.commit('setSidebarWidth', this.$el.clientWidth);
      }
      emitter.emit('sidebarWidthUpdated');
    },
  },

  updated() {
    this.updateSidebarWidth();
  },
    
}
</script>
