/**
 * @author Russell Toris - rctoris@wpi.edu
 * @author Lars Kunze - l.kunze@cs.bham.ac.uk
 */

var NAV2D = NAV2D || {
  REVISION: '0.3.0',
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A OccupancyGridClientNav uses an OccupancyGridClient to create a map for use with a Navigator.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map meta data topic to listen to
 *   * image - the URL of the image to render
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 *   * viewer - the main viewer to render to
 */
NAV2D.ImageMapClientNav = function (options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  var topic = options.topic || '/map_metadata';
  var image = options.image;
  this.serverName = options.serverName || '/move_base';
  this.actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
  this.rootObject = options.rootObject || new createjs.Container();
  this.viewer = options.viewer;
  this.withOrientation = options.withOrientation || false;

  this.navigator = null;

  // setup a client to get the map
  var client = new ROS2D.ImageMapClient({
    ros: this.ros,
    rootObject: this.rootObject,
    topic: topic,
    image: image,
  });
  client.on('change', function () {
    that.navigator = new NAV2D.Navigator({
      ros: that.ros,
      serverName: that.serverName,
      actionName: that.actionName,
      rootObject: that.rootObject,
      withOrientation: that.withOrientation,
    });

    // scale the viewer to fit the map
    that.viewer.scaleToDimensions(
      client.currentImage.width,
      client.currentImage.height
    );
    that.viewer.shift(
      client.currentImage.pose.position.x,
      client.currentImage.pose.position.y
    );
  });
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 * @author Lars Kunze - l.kunze@cs.bham.ac.uk
 */

/**
 * A navigator can be used to add click-to-navigate options to an object. If
 * withOrientation is set to true, the user can also specify the orientation of
 * the robot by clicking at the goal position and pointing into the desired
 * direction (while holding the button pressed).
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 */
NAV2D.Navigator = function (options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var serverName = options.serverName || '/move_base';
  var actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
  var withOrientation = options.withOrientation || false;
  var markerImage = options.markerImage || false;
  var pose_index = 0
  this.rootObject = options.rootObject || new createjs.Container();
  this.currentGoal = null;
  this.orientationMarker = null;
  
  // setup the actionlib client

  /**
   * Send a goal to the navigation stack with the given pose.
   *
   * @param pose - the goal pose
   */

  this.sendGoal = function(pose) {
    this.rootObject.removeChild(this.orientationMarker);

    // create waypoints
    var waypoints = new ROSLIB.Topic({
      ros : ros,
      name : '/waypoint',
      messageType : 'waypoints/waypoint_msg'
    })

    var waypoints_msg = new ROSLIB.Message({
      name : String(pose_index),
      pose : pose
    });

    waypoints.publish(waypoints_msg);

    var wp2group_client = new ROSLIB.Service({
      ros : ros,
      name : '/waypoint_server/wp_2_group',
      serviceType : 'waypoints/Wp_2_Group'
    });

    var wp2group_request = new ROSLIB.ServiceRequest({
      option : 'add',
      group_name : 'Test',
      wp_name : String(pose_index)
    });

    wp2group_client.callService(wp2group_request, function(result) {
      console.log('waypoint to group? '
        + result.success);
    });

    pose_index++;
    
    console.log("waypoint " + waypoints_msg.name + " attached");

    // create a marker for the goal
    var goalMarker = new ROS2D.NavigationArrow({
      size: 15,
      strokeSize: 1,
      fillColor: createjs.Graphics.getRGB(255, 64, 128, 0.66),
      pulse: false,
    });
    goalMarker.x = pose.position.x;
    goalMarker.y = -pose.position.y;
    goalMarker.rotation = stage.rosQuaternionToGlobalTheta(pose.orientation);
    goalMarker.scaleX = 1.0 / stage.scaleX;
    goalMarker.scaleY = 1.0 / stage.scaleY;
    that.rootObject.addChild(goalMarker);
  }

  this.cancelGoal = function () {
    var cancelGoal_client = new ROSLIB.Service({
      ros : ros,
      name : '/waypoint_server/stop_wp',
      serviceType : 'waypoints/Stop_Wp'
    });

    var cancelGoal_request = new ROSLIB.ServiceRequest({

    });

    cancelGoal_client.callService(cancelGoal_request, function(result) {
      console.log('running group '
        + result.success);
    });
  };

  this.runGroup = function () {
    var runGroup_client = new ROSLIB.Service({
      ros : ros,
      name : '/waypoint_server/run_wp',
      serviceType : 'waypoints/Run_Wp'
    });

    var runGroup_request = new ROSLIB.ServiceRequest({
      wp_name : '',
      gr_name : 'Test',
      loop : true
    });

    runGroup_client.callService(runGroup_request, function(result) {
      console.log('running group '
        + result.success);
    });
  }

  // get a handle to the stage
  var stage;
  if (that.rootObject instanceof createjs.Stage) {
    stage = that.rootObject;
  } else {
    stage = that.rootObject.getStage();
  }

  // marker for the robot
  if (markerImage) {
    var robotMarker = new ROS2D.NavigationImage({
      image: markerImage,
      pulse: true,
    });
  } else {
    var robotMarker = new ROS2D.NavigationArrow({
      size: 25,
      strokeSize: 1,
      fillColor: createjs.Graphics.getRGB(255, 128, 0, 0.66),
      pulse: true,
    });
  }
  // wait for a pose to come in first
  robotMarker.visible = false;
  this.rootObject.addChild(robotMarker);
  var initScaleSet = false;

  // setup a listener for the robot pose
  var poseListener = new ROSLIB.Topic({
    ros: ros,
    name: '/robot_pose',
    messageType: 'geometry_msgs/Pose',
    throttle_rate: 100,
  });
  poseListener.subscribe(function (pose) {
    // update the robots position on the map
    robotMarker.x = pose.position.x;
    robotMarker.y = -pose.position.y;
    if (!initScaleSet) {
      robotMarker.scaleX = 1.0 / stage.scaleX;
      robotMarker.scaleY = 1.0 / stage.scaleY;
      initScaleSet = true;
    }

    // change the angle
    robotMarker.rotation = stage.rosQuaternionToGlobalTheta(pose.orientation);

    robotMarker.visible = true;
  });

  if (withOrientation === false) {
    // setup a double click listener (no orientation)
    this.rootObject.addEventListener('dblclick', function (event) {
      // convert to ROS coordinates
      var coords = stage.globalToRos(event.stageX, event.stageY);
      var pose = new ROSLIB.Pose({
        position: new ROSLIB.Vector3(coords),
      });
      // send the goal
      // sendGoal(pose);
      emitter.emit('goalSet', pose);
    });
  } else {
    // withOrientation === true
    // setup a click-and-point listener (with orientation)
    var position = null;
    var positionVec3 = null;
    var thetaRadians = 0;
    var thetaDegrees = 0;
    // var orientationMarker = null;
    var mouseDown = false;
    var xDelta = 0;
    var yDelta = 0;

    var mouseEventHandler = function (event, mouseState) {
      //console.log(event)
      if (mouseState === 'down') {
        // get position when mouse button is pressed down
        position = stage.globalToRos(event.stageX, event.stageY);
        positionVec3 = new ROSLIB.Vector3(position);
        mouseDown = true;
      }
      else if (mouseState === 'move') {
        if (mouseDown === true) {
          // remove obsolete orientation marker
          that.rootObject.removeChild(that.orientationMarker);

          // if mouse button is held down:
          // - get current mouse position
          // - calulate direction between stored <position> and current position
          // - place orientation marker
          var currentPos = stage.globalToRos(event.stageX, event.stageY);
          var currentPosVec3 = new ROSLIB.Vector3(currentPos);

          that.orientationMarker = new ROS2D.NavigationArrow({
            size: 25,
            strokeSize: 1,
            fillColor: createjs.Graphics.getRGB(0, 255, 0, 0.66),
            pulse: false,
          });

          xDelta = currentPosVec3.x - positionVec3.x;
          yDelta = currentPosVec3.y - positionVec3.y;

          thetaRadians = Math.atan2(xDelta, yDelta);

          thetaDegrees = thetaRadians * (180.0 / Math.PI);

          if (thetaDegrees >= 0 && thetaDegrees <= 180) {
            thetaDegrees += 270;
          } else {
            thetaDegrees -= 90;
          }

          that.orientationMarker.x = positionVec3.x;
          that.orientationMarker.y = -positionVec3.y;
          that.orientationMarker.rotation = thetaDegrees;
          that.orientationMarker.scaleX = 1.0 / stage.scaleX;
          that.orientationMarker.scaleY = 1.0 / stage.scaleY;

          that.rootObject.addChild(that.orientationMarker);
        }
      }
      else if (mouseDown) {
        // mouseState === 'up'
        // if mouse button is released
        // - get current mouse position (goalPos)
        // - calulate direction between stored <position> and goal position
        // - set pose with orientation
        // - send goal
        mouseDown = false;

        var goalPos = stage.globalToRos(event.stageX, event.stageY);

        var goalPosVec3 = new ROSLIB.Vector3(goalPos);

        xDelta = goalPosVec3.x - positionVec3.x;
        yDelta = goalPosVec3.y - positionVec3.y;

        thetaRadians = Math.atan2(xDelta, yDelta);

        if (thetaRadians >= 0 && thetaRadians <= Math.PI) {
          thetaRadians += (3 * Math.PI) / 2;
        } else {
          thetaRadians -= Math.PI / 2;
        }

        var qz = Math.sin(-thetaRadians / 2.0);
        var qw = Math.cos(-thetaRadians / 2.0);

        var orientation = new ROSLIB.Quaternion({ x: 0, y: 0, z: qz, w: qw });

        var pose = new ROSLIB.Pose({
          position: positionVec3,
          orientation: orientation,
        });
        // send the goal
        // sendGoal(pose);
        console.log('goal at: ', event)
        emitter.emit('goalSet', pose);
      }
    };

    this.rootObject.addEventListener('stagemousedown', function (event) {
      mouseEventHandler(event, 'down');
    });

    this.rootObject.addEventListener('stagemousemove', function (event) {
      mouseEventHandler(event, 'move');
    });

    this.rootObject.addEventListener('stagemouseup', function (event) {
      mouseEventHandler(event, 'up');
    });
  }
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A OccupancyGridClientNav uses an OccupancyGridClient to create a map for use with a Navigator.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 *   * continuous (optional) - if the map should be continuously loaded (e.g., for SLAM)
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 *   * viewer - the main viewer to render to
 */
NAV2D.OccupancyGridClientNav = function (options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  var topic = options.topic || '/map';
  var continuous = options.continuous;
  this.serverName = options.serverName || '/move_base';
  this.actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
  this.rootObject = options.rootObject || new createjs.Container();
  this.viewer = options.viewer;
  this.withOrientation = options.withOrientation || false;
  this.markerImage = options.markerImage || false;
  this.navigator = null;

  // setup a client to get the map
  var client = new ROS2D.OccupancyGridClient({
    ros: this.ros,
    rootObject: this.rootObject,
    // continuous: continuous,
    topic: topic,
  });
  client.on('change', function () {
    that.navigator = new NAV2D.Navigator({
      ros: that.ros,
      serverName: that.serverName,
      actionName: that.actionName,
      rootObject: that.rootObject,
      withOrientation: that.withOrientation,
      markerImage: that.markerImage,
    });

    // scale the viewer to fit the map
    that.viewer.scaleToDimensions(
      client.currentGrid.width,
      client.currentGrid.height
    );
    that.viewer.shift(
      client.currentGrid.pose.position.x,
      client.currentGrid.pose.position.y
    );
  });
};

