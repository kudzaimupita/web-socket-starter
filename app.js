const express = require('express');
const ws = require('ws');

const app = express();

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', websocket => {
  console.log('⚡️ websocket connection established. Listening...')
// setInterval(() => {
    // const message = `Message from server: ${new Date().toLocaleTimeString()}`;
    // console.log(`📤 Outgoing message: "${message}"`);
    // websocket.send(message);
//   }, 1000);

  websocket.on('message', (message) => {
    console.log(`📥 Incomming message: "${message.toString()}"`);
    
    // send message back to client
    const replyMessage = `Reply to ${message.toString()}`;
    console.log(`📤 Outgoing message: "${replyMessage}"`)
    websocket.send(replyMessage, false);
  });

  websocket.on('close', ()=> {
    console.log('❌ websocket connection closed');
  });
});

app.post('/portal-variables', (req, res) => {
  const wsURL = `ws://${req.headers.host}`
  const message = `Message from server: ${new Date().toLocaleTimeString()}`;
  console.log(`📤 Outgoing message: "${message}"`);
  websocket.send(message);
  res.send(`Connect via websocket: ${wsURL}`);

});

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port} for websocket requests`);
});

// register handler to upgrade initial http request to websocket connection
server.on('upgrade', (req, socket, head) => {
  console.log('upgrading request to websocket connection - url:', req.url);

  wsServer.handleUpgrade(req, socket, head, socket => {
    wsServer.emit('connection', socket, req);
  });
});