<template>
    <div id="addmission" class="card">
        <div class="flex flex-2 sm:flex-col md:flex-row gap-70% p-1">
            <small class="text-gray-700 font-bold tracking-wider">Create Mission</small>
            <img class="items-center align-items-end
                        hover:scale-150 cursor-pointer" src="assets/icons/speed/plus.svg" />
        </div>
        <ul id="list">
            <li>

            </li>
        </ul>

        <form class="space-y-2 md:space-y-4" action="#">
            <div>
                <label for="Name Mission" class="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Name
                    Mission</label>
                <input type="text" name="Name Mission" id="Misision"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
        </form>
        <div class="flex flex-2 sm:flex-col md:flex-row gap-2 p-2">
            <button class="button bg-blue-primary hover:opacity-90 active:opacity-100" @click="SetMission">
                Set Mission
            </button>
            <button class="button bg-green-500 hover:opacity-90 active:opacity-100" @click="SaveMission"
                :class="SaveMissionClass">
                Save Mission
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {

        },

    methods: {
        SetMission() {

        },
        Waypoint() {
            var ws = new WebSocket('ws://192.168.0.107:9090'); // replace IP and port if necessary

            ws.on('open', function open() {
                console.log('New connection');
                let request_coordinates_msg = { "op": "call_service", "service": "/waypoint_db/retrieve_waypoint", "args": { "waypointName": "agv_hexaros" } };
                ws.send(JSON.stringify(request_coordinates_msg));
            });

            ws.on('message', function (msg) {
                console.log(msg);
                waypoint_coordinates = JSON.parse(msg);
                x_coordinate = waypoint_coordinates.values.pose.position.x;
                y_coordinate = waypoint_coordinates.values.pose.position.y;
                z_coordinate = waypoint_coordinates.values.pose.orientation.z;
                w_coordinate = waypoint_coordinates.values.pose.orientation.w;
                let pose_message = {
                    "op": "publish",
                    "topic": "/move_base_navi_simple/goal",
                    "msg": {
                        "header": { "frame_id": "map" },
                        "pose": { "position": { "x": x_coordinate, "y": y_coordinate }, "orientation": { "z": z_coordinate, "w": w_coordinate } }
                    }
                };
                ws.send(JSON.stringify(pose_message));
            });

            ws.on('close', function () {
                console.log('closing connection');
                ws.close();
            });
        }
    }
};
</script>


