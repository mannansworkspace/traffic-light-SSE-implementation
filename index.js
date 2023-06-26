const express = require("express");
const sse = require("./src/services/event");
var cors = require("cors");

const app = express();
app.use(cors());

const port = 3000;

app.get("/stream", sse.eventStreamHandler);

function setTrafficSignal() {
  const lights = ["red", "yellow", "green"];
  let currentLight = 0; // index
  setInterval(() => {
    sse.sendSSEData({
      eventName: "change",
      success: true,
      currentSignalLight: lights[currentLight],
    });

    currentLight = currentLight === 2 ? 0 : ++currentLight;
  }, 2 * 1000);
}

app.listen(port, () => {
  setTrafficSignal();
  console.log(`Example app listening on port ${port}`);
});
