import { eyes } from "./eye-controller.js";
// expose eyes
window.eyes = eyes;
var ros = new ROSLIB.Ros({
  url: "ws://192.168.0.186:9090",
});
// If there is an error on the backend, an 'error' emit will be emitted.
ros.on("error", function (error) {
  document.getElementById("connecting").style.display = "none";
  document.getElementById("connected").style.display = "none";
  document.getElementById("closed").style.display = "none";
  document.getElementById("error").style.display = "inline";
  console.log(error);
});

// Find out exactly when we made a connection.
ros.on("connection", function () {
  console.log("Connection made!");
  document.getElementById("connecting").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("closed").style.display = "none";
  document.getElementById("connected").style.display = "inline";
});

ros.on("close", function () {
  console.log("Connection closed.");
  document.getElementById("connecting").style.display = "none";
  document.getElementById("connected").style.display = "none";
  document.getElementById("closed").style.display = "inline";
});

var listener = new ROSLIB.Topic({
  ros: ros,
  name: "/robot_face/express",
  messageType: "std_msgs/String",
});

listener.subscribe(function (message) {
  console.log("Received message on " + listener.name + ": " + message.data);
  // listener.unsubscribe();
  eyes.stopBlinking();
  eyes.express({ type: message.data, duration: 2500 });
  setTimeout(() => {}, 1000);

  eyes.startBlinking();
});

var gaze = new ROSLIB.Service({
  ros: ros,
  name: "/robot_face/gaze",
  serviceType: "std_srvs/SetBool",
  // isAdvertised: true
})

gaze.advertise(function (req, resp) {
  console.log("Gaze srvice: " + req.data);
  if (req.data) {
    eyes.gaze();
  }
  else {
    eyes.stopGaze();
  }
  resp.success = true;
  return true
})