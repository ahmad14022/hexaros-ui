<template>
  <div
        class="mt-3 
                md:flex flex-row md:gap-3 
                sm:grid sm:grid-rows-3 sm:grid-cols-3 sm:gap-x-3"
      >
        <div class="sm:row-span-3 sm:col-span-1 md:basis-1/4">
          <Status />
          <MissionList/>
          <NavGoal />
          <AddMision />
        </div>

        <div class="sm:col-span-2 sm:row-span-2 md:basis-2/4">
          <MissionPlanner />
        </div>

        <div class="sm:hidden md:block md:basis-1/4">
          <Pose />
          <Log />
        </div>
      </div>
     
</template>

<script>
import NavGoal from "../components/main/dashboard/NavGoal.vue";
import Pose from "../components/main/dashboard/Pose.vue";
import Log from "@/components/main/dashboard/Log.vue";
import MissionPlanner from "@/components/main/dashboard/MissionPlanner.vue";
import Status from "../components/main/dashboard/Status.vue"
import MissionList from "@/components/main/dashboard/missionList.vue";
import AddMision from "@/components/main/dashboard/AddMision.vue";
export default {
  components: {
    Status,
    NavGoal,
    Pose,
    Log,
    MissionPlanner,
    MissionList,
    AddMision
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
      const map = document.getElementById('map2');
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
  
}
</script>
