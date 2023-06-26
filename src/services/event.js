const sseClients = []; // Array to store SSE client connections

const eventStreamHandler = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientConnection = { id: Date.now(), res };
  sseClients.push(clientConnection);

  const initialConnection = {
    eventName: "connect",
    success: true,
  };
  sendSSEData(initialConnection);

  req.on("close", () => {
    const index = sseClients.findIndex(
      (client) => client.id === clientConnection.id
    );
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
};

const sendSSEData = (data) => {
  sseClients.forEach((client) => {
    client.res.write(`data:${JSON.stringify(data)}\n\n`);
  });
};

const sendSSEError = () => {
  sseClients.forEach((client) => {
    client.res.write(`event: error\n`);
    client.res.write(`data: ${JSON.stringify({ error: "This is error" })}\n\n`);
  });
};

module.exports = {
  eventStreamHandler,
  sendSSEData,
  sendSSEError,
};
