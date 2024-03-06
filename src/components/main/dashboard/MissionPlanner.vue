<template>
     <div class="card p-2">
        <div
          id="map2"
          class="flex justify-center items-center
                  sm:h-auto md:h-500"
          :class="navigationModeClass"
        >

        <!-- <ul class="menu">
        <li class="menu-item" id="add">Add Marker</li>
        <li class="menu-item" id="get">Get Marker</li>
        </ul> -->

         <img v-if="!robotConnected" src="assets/images/map/mission.png" width="400" />
        </div>
      </div>
</template>

<script>
    export default{
        data() {
        return {
            nav: null,
            navCLient: null,
            pathShape: null,
            menu : null,
        };
    },

    methods: {
        renderMap() {
            var viewer = new ROS2D.Viewer({
                divID: 'map2',
                width: 500,
                height: 500,
            });

            this.navClient = new NAV2D.OccupancyGridClientNav({
                ros: this.ros,
                rootObject: viewer.scene,
                viewer: viewer,
                serverName: '/move_base',
                // markerImage: 'assets/icons/app/agv-marker.png',
                withOrientation: true,
            });

            this.$store.commit('setNavigatorClient', this.navClient);
            emitter.emit('mapLoaded');
        },

        /* 
         * Hapus map ketika koneksi terputus karena ia tidak otomatis terhapus
         */
        removeCanvas() {
            if (!this.robotConnected) {
                var map = document.getElementById('map2');
                var canvas = map.getElementsByTagName('canvas');
                while (canvas.length > 0) {
                    map.removeChild(canvas[0]);
                }
            }
        },

        /* 
         * Render path shape
         */
        createPathShape() {
            var that = this;
            this.pathShape = new ROS2D.PathShape({
                strokeSize: 1,
                strokeColor: createjs.Graphics.getRGB(0, 8, 255, 0.25),
            });

            this.navClient.rootObject.addChild(this.pathShape);

            var topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/move_base/NavfnROS/plan',
                messageType: 'nav_msgs/Path',
            });

            topic.subscribe(function (message) {
                if (
                    message !== null &&
                    typeof message !== 'undefined' &&
                    typeof message.poses !== 'undefined' &&
                    message.poses.length > 0
                ) {
                    that.pathShape.setPath(message);
                }
            });
        },

        /* 
         * Hapus path shape saat robot telah sampai tujuan
         */
        removePathShape() {
            this.navClient.rootObject.removeChild(this.pathShape);
        },

        sendLog(text, category) {
            const log = {
                text,
                category
            };
            emitter.emit('addLog', log);
        },

        // Hide() {
        //     let menu = null;
        // document.addEventListener('DOMContentLoaded', function(){
        //     //make sure the right click menu is hidden
        //     menu = document.querySelector('.menu');
        //     menu.classList.add('off');
            
        //     //add the right click listener to the box
        //     let map2 = document.getElementById('map2');
        //     map2.addEventListener('contextmenu', showmenu);
            
        //     //add a listener for leaving the menu and hiding it
        //     menu.addEventListener('mouseleave', hidemenu);
            
        //     //add the listeners for the menu items
        //     addMenuListeners();
        // });
        
        // function addMenuListeners(){
        //     document.getElementById('add').addEventListener('click', setMarker);
        //     document.getElementById('get').addEventListener('click', setMarker);
        // }
        
        // function setMarker(ev){
        //     hidemenu();
        //     var marker =  ev.target.id;
        //     document.getElementById('map').marker;
        // }
        
        // function showmenu(ev){
        //     //stop the real right click menu
        //     ev.preventDefault(); 
        //     //show the custom menu
        //     console.log( ev.clientX, ev.clientY );
        //     menu.style.top = `${ev.clientY - 20}px`;
        //     menu.style.left = `${ev.clientX - 20}px`;
        //     menu.classList.remove('off');
        // }
        
        // function hidemenu(ev){
        //     menu.classList.add('off');
        //     menu.style.top = '-200%';
        //     menu.style.left = '-200%';
        // }
        // this.$el.addEventListener('click', this.Hide);
        // }
    },

    computed: {
        ros() {
            return this.$store.state.ros;
        },

        robotConnected() {
            return this.$store.state.robotConnected;
        },

        navigationModeClass() {
            return {
                'pointer-events-none': this.$store.state.navigationMode === 'Joystick' ||
                    this.$store.state.goalSent,
                'bg-gray-100': !this.$store.state.robotConnected,
            };
        },
    },

    mounted() {
        /*
         * Render map saat berhasil terhubung ke ros pertama kali
         */
        emitter.on('connected', () => {
            this.renderMap();
        });

        /*
         * Saat ros masih terhubung dan kemudian kita mengunjungi halaman lain, seperti About, maka
         * map akan hilang. Oleh karena itu, ia perlu dirender kembali saat kembali ke Dashboard.
         */
        if (this.robotConnected) {
            this.renderMap();
        }

        /* 
         * Kirim goal ke ros server
         */
        emitter.on('sendGoal', (pose) => {
            this.navClient.navigator.sendGoal(pose);
            this.createPathShape();
            this.$store.commit('setGoalSet', false);
            this.$store.commit('setGoalSent', true);
            this.sendLog('Goal sent', 'info');
        });

        /* Saat robot berhenti, ada dua kemungkinan yaitu ia telah sampai ke tujuan atau ia dihentikan
         * di tengah jalan (goal canceled). Maka harus diperhatikan statusnya untuk mengirim log yang sesuai
         */
        emitter.on('goalResult', (result) => {
            this.$store.commit('setGoalSent', false);
            this.removePathShape();
            if (result.status === 3) {
                this.sendLog('Goal reached', 'success');
            } else if (result.status === 2) {
                this.sendLog('Goal canceled', 'error');
            }
        });

    },

    updated() {
        /*
         * Saat robot disconnect, hapus canvas/map 
         */
        this.removeCanvas();
    }, 
    }
</script>

<style>
 .menu{
            width: 12rem;
            height: 4.5rem;
            background-color: #f4f4f4;
            color: #333;
            border: 1px solid #aaa;
            box-shadow: 2px 2px 2px #999;
            border-radius: 0.2rem;
            list-style: none;
            position: fixed;
            z-index: 2;
        }
        .menu.off{
            top: -200%;
            left: -200%;
        }
        .menu-item{
            height: 1.5rem;
            line-height: 1.5rem;
            font-size: 1rem;
            font-weight: 100;
            padding: 0 1rem;
            cursor: pointer;
        }
        .menu-item:hover,
        .menu-item:active{
            color: #000;
            font-weight: 500;
        }
</style>