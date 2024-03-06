<template>
   <div class="card">
        <div id="joystick" class="relative h-44" :class="connectionClass"></div>
      </div>
</template>

<script>
export default {
  data() {
    return {
      joystick: null,
    };
  },

  computed: {
    ros() {
      return this.$store.state.ros;
    },

    connectionClass() {
      return {
        // Disable joystick saat robot tidak terhubung
        'pointer-events-none': !this.$store.state.robotConnected,
      };
    },

    /* Kecepatan maju mundur */
    linearSpeed() {
      return this.$store.state.linearSpeed;
    },

    /* Kecepatan belok kanan kiri */
    angularSpeed() {
      return this.$store.state.angularSpeed;
    },
  },

  methods: {
    move(linear, angular) {
      this.publisher = new ROSLIB.Topic({
        ros: this.ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });


      var _linear = (linear * this.linearSpeed) / 1.0;
      console.log(_linear)
      var _angular = -(angular * this.angularSpeed) / 1.0;
      console.log(_angular)
      var twist = new ROSLIB.Message({
        linear: {
          x: _linear,
          y: 0,
          z: 0,
        },
        angular: {
          x: 0,
          y: 0,
          z: _angular,
        },
      });

      this.publisher.publish(twist);
    },

    sendLog(text, category) {
      const log = { text, category };
      emitter.emit('addLog', log);
    },

    createJoystick() {
      var that = this;
      var options = {
        zone: document.getElementById('joystick'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: '#0369A1',
        dynamicPage: true,
        size: 100,
      }
      this.joystick = nipplejs.create(options);

      this.linear_speed = 0;
      this.angular_speed = 0;

      this.joystick.on('start', (event, nipple) => {
        this.timer = setInterval(function () {
          that.move(that.linear_speed, that.angular_speed);
        }, 25);
      });

      this.joystick.on('move', (event, nipple) => {
        
        if (nipple.distance / 50 > 0.1) {
          that.linear_speed =
            (Math.sign(Math.sin(nipple.angle.radian)) * nipple.distance) / 50;
        } else {
          that.linear_speed = 0;
        }
        that.angular_speed = Math.cos(nipple.angle.radian);
      });

      this.joystick.on('end', () => {
        if (that.timer) {
          clearInterval(that.timer);
        }
        that.move(0, 0);
      });
    },
  },

  mounted() {
    this.createJoystick();
  }
}
</script>
  
