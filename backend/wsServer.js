const http = require("http")
const WebSocket = require("ws")
const { setupWSConnection } = require("y-websocket/bin/utils")

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end("Mditor WebSocket Server")
})

const wss = new WebSocket.Server({ server })

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req)
})

server.listen(1234, () => {
  console.log("WebSocket server running on ws://localhost:1234")
})
