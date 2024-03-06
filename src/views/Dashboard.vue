<template>
   <div
        class="mt-3 
                md:flex flex-row md:gap-3 
                sm:grid sm:grid-rows-3 sm:grid-cols-3 sm:gap-x-3"
      >
        <div class="sm:row-span-3 sm:col-span-1 md:basis-1/4">
          <Connection/>
          <NavigationMode/>
          <Speed v-if="modeJoystick"/>
          <Joystick v-if="modeJoystick"/>
          <NavGoal v-else />
        </div>

        <div class="sm:col-span-2 sm:row-span-2 md:basis-3/4">
          <Map />
        </div>

        <!-- <div class="sm:hidden md:block md:basis-1/4">
          <Pose />
          <Log />
        </div> -->
      </div>
</template>

<script>
import Connection from "../components/main/dashboard/Connection.vue";
import NavigationMode from "../components/main/dashboard/NavigationMode.vue";
import Joystick from "../components/main/dashboard/Joystick.vue";
import NavGoal from "../components/main/dashboard/NavGoal.vue";
import Pose from "../components/main/dashboard/Pose.vue";
import Log from "@/components/main/dashboard/Log.vue";
import Map from "../components/main/dashboard/Map.vue";
import Speed from "../components/main/dashboard/Speed.vue";
export default {
  
  components: {
    Connection,
    NavigationMode,
    Joystick,
    Speed,
    NavGoal,
    Pose,
    Log,
    Map
},


data() {
    return {
      ros: null,
      viewer: null,
      nav: null,
    };
  },

  computed: {
    modeJoystick() {
      return this.$store.state.navigationMode === 'Joystick';
    },
  },

  methods: {
    removeCanvasses() {
      const map = document.getElementById('map');
      let canvasses = map.getElementsByTagName('canvas');
      while (canvasses.length > 1) {
        map.removeChild(canvasses[0]);
      }
    },

    sendLog(text, category) {
      const log = { text, category };
      emitter.emit('addLog', log);
    },
  },

  mounted() {
    emitter.on('mapLoaded', () => {
      this.removeCanvasses();
    });
  },
 
};

</script>
