const net = require("net");

const client = net.createConnection(2877, "34.219.80.229", () => {
  console.log(client, "client");
  console.log(client.localAddress);
  client.on("data", data => {
    console.log(data.toString());
  });
  process.stdin.pipe(client);
});