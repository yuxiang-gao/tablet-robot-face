import eyes from "./eye-controller.js";
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
  name: "/face",
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
