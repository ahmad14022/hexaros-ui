<template>
  <div id="connection" class="card">
       <div class="mb-1">
         <small class="text-gray-700 font-bold tracking-wider"
           >Connection</small
         >
       </div>
       <div class="flex flex-3 gap-x-1 sm:flex-col md:flex-row">
         <div class="basis-2/3">
           <input
             class="input text-center tracking-widest focus:outline-none"
             type="text"
             v-model="ip"
             placeholder="IP"
           />
         </div>
         <div class="basis-1/3">
           <input
             class="input text-center tracking-wider focus:outline-none"
             type="text"
             v-model="port"
             placeholder="Port"
           />
         </div>
       </div>
       <div>
         <div class="flex mt-1">
           <button
             v-if="!robotConnected"
             class="button bg-blue-primary hover:opacity-90"
             @click="connect"
           >
             Connect
           </button>
           <button
             v-else
             class="button bg-red-500 hover:opacity-90"
             @click="disconnect"
           >
             Disconnect
           </button>
         </div>
       </div>
     </div>
</template>

<script>
export default {
   data() {
   return {
     ros: null,
     ip: 'localhost',
     port: '9090', // Port default
   };
 },

 computed: {
   robotConnected() {
     return this.$store.state.robotConnected;
   },

   goalSent() {
     return this.$store.state.goalSent;
   },
 },

 methods: {
   connect() {
     if (this.ip === '' || this.port === '') {
       this.sendLog('IP or port is empty', 'error');
       return;
     }

     const connectionData = {
       ip: this.ip,
       port: this.port,
     };

     const options = {
       url: `ws://${connectionData.ip}:${connectionData.port}`,
     };

     this.ros = new ROSLIB.Ros(options);

     this.ros.on('connection', () => {
       this.$store.commit('setRobotConnected', true);
       this.sendLog(
         `Connected to ${connectionData.ip} on port ${connectionData.port}`,
         'success'
       );
       this.$store.commit('setRos', this.ros);
       // Emit 'connected' event to map component
       emitter.emit('connected');
     });

     this.ros.on('close', () => {
       if (this.robotConnected) {
         this.disconnect();
       }
     });

     this.ros.on('error', (error) => {
       this.sendLog('Error connecting to websocket server.', 'error');
     });

     this.$store.commit('setConnectionData', connectionData);

     var addGroup = new ROSLIB.Service({
       ros : this.ros,
       name : '/waypoint_server/groups_wp',
       serviceType : 'waypoints/Group_Wp'
     });

     var addGroup_request = new ROSLIB.ServiceRequest({
       option : 'add',
       group_name : 'Test'
     });

     addGroup.callService(addGroup_request, function(result) {
       console.log('Result creating group '
         + result.success);
     });
   },

   disconnect() {
     if (this.goalSent) {
       emitter.emit('cancelGoal');
     }
     if (this.ros !== null) {
       this.ros.close();
       this.ros = null;
     }
     this.$store.commit('setRos', this.ros);
     this.$store.commit('setNavigatorClient', null);
     this.$store.commit('setConnectionData', null);
     this.$store.commit('setRobotConnected', false);

     if (!this.robotConnected) {
       emitter.emit('disconnected');
       this.sendLog(`Connection closed`, 'error');
     }
   },

   sendLog(text, category) {
     const log = { text, category };
     emitter.emit('addLog', log);
   },

   saveConnectionData() {
     const connectionData = {
       ip: this.ip,
       port: this.port,
     };
     this.$store.commit('setConnectionData', connectionData);
   },

   loadConnectionData() {
     const connectionData = this.$store.state.connectionData;
     if (connectionData) {
       this.ip = connectionData.ip;
       this.port = connectionData.port;
     }
   },
 },

 mounted() {
   /* 
    * Muat data koneksi dari local storage
    */
   this.loadConnectionData();
 },

 /*
  * Ketika berpindah halaman, simpan data koneksi ke local storage 
  */
 watch: {
   $route(to, from) {
     this.saveConnectionData();
   },
 },
}
</script>
